import { Link, useOutletContext } from 'react-router-dom';
import { FileSearch, Landmark, UserPlus } from 'lucide-react';
import type { AlumniPortalContext } from '../../layouts/AlumniSystemLayout';

const SCHOOL_MILESTONES = [
  { year: '1941', label: 'Idea of a college in Aklan conceived' },
  { year: '1945', label: 'Articles of Incorporation and By-Laws approved' },
  { year: '1945', label: 'First Board of Trustees elected' },
  { year: 'Today', label: 'Aklan College alumni community' }
];

const AlumniSystemHome = () => {
  const { user, registration } = useOutletContext<AlumniPortalContext>();
  const firstName = (user?.name || '').trim().split(' ')[0];

  return (
    <div className="page-content">
      {/* Welcome banner */}
      <section className="alumni-hero alumni-hero-portal">
        <img src="/images/accbuild.jpg" alt="" aria-hidden="true" className="alumni-hero-img" />
        <div className="alumni-hero-overlay">
          <span className="alumni-hero-badge">Alumni Self-Service Portal</span>
          <h2>{firstName ? `Welcome back, ${firstName}!` : 'Welcome!'}</h2>
          <p>ACC Alumni Management System</p>
          <div className="alumni-hero-actions">
            {!registration && (
              <Link to="/alumni/registration" className="btn btn-flat alumni-btn-light">
                <UserPlus size={16} />
                Register Now
              </Link>
            )}
            <Link to="/alumni/status" className="btn btn-flat alumni-btn-ghost">
              <FileSearch size={16} />
              Check Registration Status
            </Link>
          </div>
        </div>
      </section>

      <section className="alumni-card">
          <div className="alumni-card-header">
            <h3><Landmark size={16} /> School History</h3>
            <span className="alumni-card-tag">Est. 1945</span>
          </div>

          <div className="alumni-school-history">
            <p>
              The noble idea of establishing an educational institution in the college level in
              Aklan offering academic courses had its inception before the last war. The
              inclusive months of August &ndash; October, 1941 were devoted to its organization.
              The outbreak of the War stalled its foundation.
            </p>
            <p>
              After the liberation, prominent men and educators in Aklan adhered and joined
              efforts to organize. A committee composed of seven members was constituted. The
              committee elected Mr. Digno Alba as Chairman. A finance committee headed by
              Mr. Vicente M. Salido and a committee on style to draft the Articles of
              Incorporation and By-laws headed by Atty. Ludovico O. Peralta were also formed.
              A group took charge of conducting a campaign for stockholders and students
              throughout Aklan.
            </p>
            <p>
              Among others, this group was composed of Mr. Digno Alba, Mr. Filemon F. Guerra,
              Mr. Emeterio L. Prado, Mr. Luis Enriquez, Atty. Ludovico O. Peralta, Mr. Vicente
              M. Salido, Dr. Rafael S. Tumbokon, Mr. Manuel O. Peralta, Mr. Teodoro P. Icamina
              and Mr. Juan Tolentino. On August 18, 1945, in a meeting of stockholders, the
              Articles of Incorporation and By-Laws drafted by the Peralta Committee were
              approved and submitted to the Securities and Exchange Commission. Moreover, the
              fifteen incorporators and the members of the Board of Trustees were elected.
            </p>
            <p>
              The fifteen incorporators elected according to the number of votes cast were:
              Dean Filemon G. Guerra, Atty. Manuel Laserna, Atty. Raz Meñez, Atty. Ludovico
              O. Peralta, Dr. Federico R. Meñez, Mr. Digno Alba, Prof. Vicente M. Salido,
              Prof. Emeterio L. Prado, Atty. Jose A. Urquiola, Prof. Jose M. Reyes, Dr. Querubin
              Fulgencio, Mr. Jesus Aranas, Dr. Salvador R. Acevedo, Dr. Rafael S. Tumbokon and
              Dr. Conrado F. Quimpo. The first Board of Trustees was presided by Atty. Jose Q.
              Peralta. Other members of the first Board of Trustees elected were Dean Filemon
              F. Guerra, Atty. Manuel Laserna, Dr. Federico R. Meñez, Atty. Ludovico O. Peralta,
              Mr. Digno Alba, Prof. Vicente Salido, Prof. Emeterio L. Prado, Atty. Jose A.
              Urquiola, Prof. Jose M. Reyes, Dr. Querubin Fulgencio, Mr. Jesus Aranas, Dr.
              Salvador R. Acevedo, Dr. Rafael S. Tumbokon and Dr. Conrado F. Quimpo. Dr.
              Federico R. Meñez was elected by the stock subscribers as the first treasurer of
              the corporation.
            </p>
            <p>
              There were 73 original stockholders of the Aklan College, Inc., to wit; Digno
              Alba, George Alba, Ricardo Alba, Edita Albar, Joaquin Acevedo, Salvador Acevedo,
              Jesus Aranas, Manuel Andrade, Lucila Advincula, Adorico Bantigue, Benjamin
              Barrios, Maria Barrios, Josedicio Bautista, Miguel Calizo, Crispulo Cruz, Eulogio
              Cleope, Leopoldo dela Cruz, Luis Enriquez, Pamposa U. Sitioko, Salvador Esmero,
              Querubin Fulgencio, Eduardo Fuerte, Carolina Francisco, Filemeon F. Guerra,
              Juanito Garcia, Patria Gonzales, Nicanor Gonzales, Florencio Garcia, Teodoro
              Icamina, Florentina Icamina, Ester Jurilla, Albina Losada, Pacita Lamuntao,
              Federico Luces, Manuel Laserna, Jose Mabasa, Salvador Mabasa, Federico Meñez,
              Jose R. Meñez, Nicena T. Morales, Iluminado Motus, Pedro Oquendo, Ludovico
              Peralta, Manuel Peralta, Jose Peralta, Emeterio L. Prado, Conrado Quimpo, Fidel
              Quimpo, Jose Quimpo, Vicente Quimpo, Rustico Quimpo, Castor Reyes, Emeterio
              Roldan, Vicente Romaquin, Loreto del Rosario, Jose M. Reyes, Salvador Reyes, Jose
              Salazar, Vicente M. Salido, Bienvenido Songco, Soledad Suarez, Rafael Tumbokon,
              Crisanta Ureta, Jose Urquiola, Edicio Venturanza, Sergio Vizcarra, Simplicia
              Vega, Adriano Seraspi, Juan Tolentino Jr. and Avelino Torre.
            </p>

            <div className="alumni-milestones">
              {SCHOOL_MILESTONES.map((milestone) => (
                <div key={milestone.label} className="alumni-milestone">
                  <span className="alumni-milestone-year">{milestone.year}</span>
                  <span>{milestone.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
    </div>
  );
};

export default AlumniSystemHome;