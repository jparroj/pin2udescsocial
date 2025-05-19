// src/main/java/br/udesc/udescsocial/backend/repository/UsuarioRepository.java
package br.udesc.udescsocial.backend.repository;

import br.udesc.udescsocial.backend.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    // Busca por email (como você já tem)
    Usuario findByEmail(String email);
    
    // Adicione também busca por matrícula caso necessário
    Usuario findByMatricula(String matricula);
    
    // Ou método combinado para buscar por email ou matrícula
    @Query("SELECT u FROM Usuario u WHERE u.email = :identificador OR u.matricula = :identificador")
    Usuario findByIdentificador(@Param("identificador") String identificador);
}