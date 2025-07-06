package br.udesc.udescsocial.backend.controller;

import jakarta.validation.constraints.*;

public record ProfessorRequest(
    @NotNull(message = "ID do usuário é obrigatório")
    Long usuarioId, 

    @NotBlank(message = "Departamento é obrigatório")
    String departamento
) {
   
}