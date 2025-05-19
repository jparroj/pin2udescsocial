package br.udesc.udescsocial.backend.controller;

import jakarta.validation.constraints.*;

public record ProfessorRequest(
    @NotNull(message = "ID do usuário é obrigatório")
    Long usuarioId,  // Isso automaticamente cria o método usuarioId()

    @NotBlank(message = "Departamento é obrigatório")
    String departamento
) {
    // Records automaticamente geram métodos como usuarioId() e departamento()
}