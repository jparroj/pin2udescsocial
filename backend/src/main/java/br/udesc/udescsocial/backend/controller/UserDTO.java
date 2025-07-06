// backend/src/main/java/br/udesc/udescsocial/backend/controller/UserDTO.java
package br.udesc.udescsocial.backend.controller;

import br.udesc.udescsocial.backend.entity.Usuario;
import br.udesc.udescsocial.backend.entity.Professor;

public record UserDTO(
    Long id,
    String nome,
    String email,
    String tipo,
    Long professorId 
) {
    public UserDTO(Usuario usuario) {
        this(
            usuario.getId(),
            usuario.getNome(),
            usuario.getEmail(),
            usuario.getTipo(),
            (usuario.getTipo() != null && usuario.getTipo().equals("PROFESSOR") && usuario.getProfessor() != null) 
                ? usuario.getProfessor().getId() : null
        );
    }
}
