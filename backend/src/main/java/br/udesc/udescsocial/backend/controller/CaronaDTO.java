// backend/src/main/java/br/udesc/udescsocial/backend/controller/CaronaDTO.java
package br.udesc.udescsocial.backend.controller;

import br.udesc.udescsocial.backend.entity.Carona;
import br.udesc.udescsocial.backend.entity.Usuario;
import java.time.LocalDate;
import java.time.LocalTime;

public record CaronaDTO(
    Long id,
    String origem,
    String destino,
    LocalDate data,
    LocalTime horario,
    Integer vagas,
    String descricao,
    String ofertanteNome,
    Long ofertanteId,
    String ofertanteTipo
) {
    public CaronaDTO(Carona carona) {
        this(
            carona.getId(),
            carona.getOrigem(),
            carona.getDestino(),
            carona.getData(),
            carona.getHorario(),
            carona.getVagas(),
            carona.getDescricao(),
            carona.getOfertante() != null ? carona.getOfertante().getNome() : "Desconhecido",
            carona.getOfertante() != null ? carona.getOfertante().getId() : null,
            carona.getOfertante() != null ? carona.getOfertante().getTipo() : null
        );
    }
}

record OfertanteDTO(
    Long id,
    String nome
) {
    public OfertanteDTO(Usuario usuario) {
        this(
            usuario.getId(),
            usuario.getNome()
        );
    }
}

record AvaliacaoCaronaDTO(
    Long id,
    Long caronaId,
    OfertanteDTO avaliador,
    OfertanteDTO avaliado,
    String nota,
    String comentario,
    LocalDate dataAvaliacao
) {
    public AvaliacaoCaronaDTO(br.udesc.udescsocial.backend.entity.AvaliacaoCarona avaliacao) {
        this(
            avaliacao.getId(),
            avaliacao.getCarona() != null ? avaliacao.getCarona().getId() : null,
            new OfertanteDTO(avaliacao.getAvaliador()),
            new OfertanteDTO(avaliacao.getAvaliado()),
            avaliacao.getNota(),
            avaliacao.getComentario(),
            avaliacao.getDataAvaliacao()
        );
    }
}
