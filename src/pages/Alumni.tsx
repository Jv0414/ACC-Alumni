import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Pencil, Users } from 'lucide-react';
import DataTable, { type Column } from '../components/DataTable';
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';
import EmptyState from '../components/EmptyState';
import type { Alumni as AlumniType } from '../types/Alumni';
import { alumniData as initialAlumniData } from '../data/alumniData';
import { getInitials } from '../utils/formatters';

const PAGE_SIZE = 5;

const Alumni = () => {
  const [alumniList] = useState<AlumniType[]>(initialAlumniData);
  const [search, setSearch] = useState('');
  const [courseFilter, setCourseFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState('id');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const navigate = useNavigate();

  const handleView = (alumni: AlumniType) => {
    navigate(`/alumni/${alumni.id}`);
  };

  const courses = useMemo(() => {
    return Array.from(new Set(alumniList.map((a) => a.course))).sort();
  }, [alumniList]);

  const years = useMemo(() => {
    return Array.from(new Set(alumniList.map((a) => a.graduationYear))).sort().reverse();
  }, [alumniList]);

  const filteredAlumni = useMemo(() => {
    let filtered = alumniList;

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
  }, [alumniList, search, courseFilter, yearFilter, sortKey, sortDirection]);

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

  const columns: Column<AlumniType>[] = [
    {
      key: 'id',
      header: 'ID',
      sortable: false,
      render: (a) => <span className="text-muted">{a.id}</span>
    },
    {
      key: 'fullName',
      header: 'Name',
      sortable: false,
      render: (a) => (
        <div className="alumni-name-cell">
          <div className="avatar" style={{ backgroundColor: a.avatarColor }}>
            {getInitials(a.fullName)}
          </div>
          <div>
            <div className="alumni-name">{a.fullName}</div>
            <div className="alumni-email">{a.email}</div>
          </div>
        </div>
      )
    },
    {
      key: 'course',
      header: 'Course',
      sortable: false,
      render: (a) => <span>{a.course}</span>
    },
    {
      key: 'graduationYear',
      header: 'Graduation Year',
      sortable: false,
      render: (a) => <span>{a.graduationYear}</span>
    },
    {
      key: 'location',
      header: 'Location',
      sortable: false,
      render: (a) => <span>{a.location}</span>
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

      <div className="card">
        <div className="card-header card-header-actions">
          <div className="filters-row">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search alumni by name, email, course..."
            />
            <select
              className="filter-select"
              value={courseFilter}
              onChange={(e) => { setCourseFilter(e.target.value); setCurrentPage(1); }}
            >
              <option value="all">All Courses</option>
              {courses.map((course) => (
                <option key={course} value={course}>{course}</option>
              ))}
            </select>
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
            title="No alumni found"
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