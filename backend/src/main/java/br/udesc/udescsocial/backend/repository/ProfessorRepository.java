// classe ProfessorRepository para fornecer acesso a entidade Professor no banco de dados.
package br.udesc.udescsocial.backend.repository;

import br.udesc.udescsocial.backend.entity.Professor;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProfessorRepository extends JpaRepository<Professor, Long> {
}