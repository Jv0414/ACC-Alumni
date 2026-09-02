import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, GraduationCap, Pencil, Plus, School, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import DataTable, { type Column } from '../components/DataTable';
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';
import EmptyState from '../components/EmptyState';
import type { Alumni as AlumniType, EducationLevel } from '../types/Alumni';
import { alumniData as initialAlumniData } from '../data/alumniData';
import { COLLEGE_COURSE_OPTIONS } from '../data/collegePrograms';
import { formatDate, getInitials } from '../utils/formatters';

const PAGE_SIZE = 5;

// The alumni records page groups records by education level. Elementary and
// Senior High School records share the same shape as college records; only
// the program labels (course / strand / grade level) differ per level.
interface LevelConfig {
  id: EducationLevel;
  label: string;
  icon: LucideIcon;
  programLabel: string;
  filterLabel: string;
  emptyTitle: string;
}

const LEVELS: LevelConfig[] = [
  {
    id: 'College',
    label: 'College',
    icon: GraduationCap,
    programLabel: 'Course',
    filterLabel: 'All Courses',
    emptyTitle: 'No college alumni found'
  },
  {
    id: 'Senior High School',
    label: 'Senior High School',
    icon: School,
    programLabel: 'Strand',
    filterLabel: 'All Strands',
    emptyTitle: 'No senior high school alumni found'
  },
  {
    id: 'Elementary',
    label: 'Elementary',
    icon: BookOpen,
    programLabel: 'Grade Level',
    filterLabel: 'All Grade Levels',
    emptyTitle: 'No elementary alumni found'
  }
];

const Alumni = () => {
  const [alumniList] = useState<AlumniType[]>(initialAlumniData);
  const [level, setLevel] = useState<EducationLevel>('College');
  const [search, setSearch] = useState('');
  const [courseFilter, setCourseFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState('id');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const navigate = useNavigate();

  const activeLevel = LEVELS.find((l) => l.id === level) ?? LEVELS[0];

  // Switching lists starts a fresh search so filters never leak across levels.
  const handleLevelChange = (next: EducationLevel) => {
    if (next === level) return;
    setLevel(next);
    setSearch('');
    setCourseFilter('all');
    setYearFilter('all');
    setCurrentPage(1);
  };

  const handleView = (alumni: AlumniType) => {
    navigate(`/alumni/${alumni.id}`);
  };

  const levelAlumni = useMemo(() => {
    return alumniList.filter((a) => a.educationLevel === level);
  }, [alumniList, level]);

  const courses = useMemo(() => {
    // College filters against the full official program list so every offering
    // is selectable even when no records exist for it yet. The other levels
    // derive their options from the records (strands / grade levels).
    if (level === 'College') {
      return COLLEGE_COURSE_OPTIONS;
    }
    return Array.from(new Set(levelAlumni.map((a) => a.course))).sort();
  }, [level, levelAlumni]);

  const years = useMemo(() => {
    return Array.from(new Set(levelAlumni.map((a) => a.graduationYear))).sort().reverse();
  }, [levelAlumni]);

  const filteredAlumni = useMemo(() => {
    let filtered = levelAlumni;

    if (search) {
      const query = search.toLowerCase();
      filtered = filtered.filter(
        (a) =>
          a.fullName.toLowerCase().includes(query) ||
          a.email.toLowerCase().includes(query) ||
          a.studentId.toLowerCase().includes(query) ||
          a.course.toLowerCase().includes(query) ||
          a.company.toLowerCase().includes(query)
      );
    }

    if (courseFilter !== 'all') {
      filtered = filtered.filter((a) => a.course === courseFilter);
    }

    if (yearFilter !== 'all') {
      filtered = filtered.filter((a) => a.graduationYear === Number(yearFilter));
    }

    const sorted = [...filtered].sort((a, b) => {
      const aVal = a[sortKey as keyof AlumniType];
      const bVal = b[sortKey as keyof AlumniType];
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }
      const aStr = String(aVal).toLowerCase();
      const bStr = String(bVal).toLowerCase();
      return sortDirection === 'asc' ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr);
    });

    return sorted;
  }, [levelAlumni, search, courseFilter, yearFilter, sortKey, sortDirection]);

  const totalPages = Math.ceil(filteredAlumni.length / PAGE_SIZE);
  const paginatedAlumni = filteredAlumni.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  // Elementary alumni have no program/grade level column - the other levels
  // show Course, Strand or Grade Level instead.
  const programColumn: Column<AlumniType> | null =
    activeLevel.id === 'Elementary'
      ? null
      : {
          key: 'course',
          header: activeLevel.programLabel,
          sortable: false,
          render: (a) => <span>{a.course}</span>
        };

  const columns: Column<AlumniType>[] = [
    {
      key: 'fullName',
      header: 'Full Name',
      sortable: false,
      render: (a) => (
        <div className="alumni-name-cell">
          <div className="avatar" style={{ backgroundColor: a.avatarColor }}>
            {getInitials(a.fullName)}
          </div>
          <div className="alumni-name">{a.fullName}</div>
        </div>
      )
    },
    ...(programColumn ? [programColumn] : []),
    {
      key: 'phone',
      header: 'Number',
      sortable: false,
      render: (a) => <span>{a.phone}</span>
    },
    {
      key: 'email',
      header: 'Email',
      sortable: false,
      render: (a) => <span>{a.email}</span>
    },
    {
      key: 'address',
      header: 'Address',
      sortable: false,
      render: (a) => <span>{a.address}</span>
    },
    {
      key: 'registeredAt',
      header: 'Date Registered',
      sortable: false,
      render: (a) => <span>{formatDate(a.registeredAt)}</span>
    },
    {
      key: 'actions',
      header: 'Actions',
      render: () => (
        <div className="action-buttons">
          <button className="action-btn action-edit" title="Edit" onClick={(e) => { e.stopPropagation(); }}>
            <Pencil size={16} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="page-content">
      <div className="page-header">
        <h1>ACC Alumni</h1>
        <p>Manage and track all alumni records</p>
      </div>

      <div className="level-tabs" role="tablist" aria-label="Alumni education level">
        {LEVELS.map((lvl) => {
          const Icon = lvl.icon;
          const count = alumniList.filter((a) => a.educationLevel === lvl.id).length;
          const isActive = level === lvl.id;
          return (
            <button
              key={lvl.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`level-tab${isActive ? ' active' : ''}`}
              onClick={() => handleLevelChange(lvl.id)}
            >
              <Icon size={16} />
              {lvl.label}
              <span className="level-tab-count">{count}</span>
            </button>
          );
        })}
      </div>

      <div className="card">
        <div className="card-header card-header-actions">
          <div className="filters-row">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder={
                activeLevel.id === 'Elementary'
                  ? 'Search elementary alumni by name or email...'
                  : `Search ${activeLevel.label.toLowerCase()} alumni by name, email, ${activeLevel.programLabel.toLowerCase()}...`
              }
            />
            {activeLevel.id !== 'Elementary' && (
              <select
                className="filter-select"
                value={courseFilter}
                onChange={(e) => { setCourseFilter(e.target.value); setCurrentPage(1); }}
              >
                <option value="all">{activeLevel.filterLabel}</option>
                {courses.map((course) => (
                  <option key={course} value={course}>{course}</option>
                ))}
              </select>
            )}
            <select
              className="filter-select"
              value={yearFilter}
              onChange={(e) => { setYearFilter(e.target.value); setCurrentPage(1); }}
            >
              <option value="all">Year Graduated</option>
              {years.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          <button className="btn btn-primary btn-flat" onClick={() => {}}>
            <Plus size={16} />
            Add Alumni
          </button>
        </div>

        {filteredAlumni.length === 0 ? (
          <EmptyState
            title={activeLevel.emptyTitle}
            description="Try adjusting your search or filter criteria"
            icon={<Users size={48} />}
          />
        ) : (
          <>
            <DataTable
              columns={columns}
              data={paginatedAlumni}
              onRowClick={handleView}
              sortKey={sortKey}
              sortDirection={sortDirection}
              onSort={handleSort}
            />
            <div className="table-footer">
              <span className="table-info">
                Showing {(currentPage - 1) * PAGE_SIZE + 1} - {Math.min(currentPage * PAGE_SIZE, filteredAlumni.length)} of {filteredAlumni.length} alumni
              </span>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Alumni;