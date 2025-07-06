// backend/src/main/java/br/udesc/udescsocial/backend/controller/MuralUpdateRequest.java
package br.udesc.udescsocial.backend.controller;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record MuralUpdateRequest(
    @NotNull(message = "ID da publicação é obrigatório para atualização")
    Long id,

    @NotNull(message = "Autor (Professor) é obrigatório")
    Long autorId,

    @NotBlank(message = "Título é obrigatório")
    String titulo,

    @NotBlank(message = "Conteúdo é obrigatório")
    String conteudo,

    @NotBlank(message = "Categoria é obrigatória")
    String categoria
) {}