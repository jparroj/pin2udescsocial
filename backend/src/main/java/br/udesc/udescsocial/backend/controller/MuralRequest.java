/**
 * Classe MuralRequest
 * 
 * Usuario: Lucas Eduardo

 */
package br.udesc.udescsocial.backend.controller;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record MuralRequest(
    @NotNull(message = "Autor (Professor) é obrigatório")
    Long autorId,

    @NotBlank(message = "Título é obrigatório")
    String titulo,

    @NotBlank(message = "Conteúdo é obrigatório")
    String conteudo,

    @NotBlank(message = "Categoria é obrigatória")
    String categoria
) {}

