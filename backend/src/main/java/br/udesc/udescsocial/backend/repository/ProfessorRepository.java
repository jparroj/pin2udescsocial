package br.udesc.udescsocial.backend.repository;

import br.udesc.udescsocial.backend.entity.Professor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.Optional;
import java.util.List;

public interface ProfessorRepository extends JpaRepository<Professor, Long> {
    
    @Query("SELECT p FROM Professor p JOIN FETCH p.usuario")
    List<Professor> findAllWithUsuario();
    boolean existsByUsuarioId(Long usuarioId);
    Optional<Professor> findByUsuarioId(Long usuarioId);
}