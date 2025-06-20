// backend/src/main/java/br/udesc/udescsocial/backend/controller/CaronaDTO.java
package br.udesc.udescsocial.backend.controller;

import br.udesc.udescsocial.backend.entity.Carona;
import br.udesc.udescsocial.backend.entity.Usuario; // Importar Usuario
import java.time.LocalDate;
import java.time.LocalTime;

// CaronaDTO representa uma carona para ser enviada ao frontend
public record CaronaDTO(
    Long id,
    String origem,
    String destino,
    LocalDate data,
    LocalTime horario,
    Integer vagas,
    String descricao,
    String ofertanteNome, // Nome do ofertante
    Long ofertanteId,     // ID do ofertante, útil para ações futuras
    String ofertanteTipo  // Tipo do ofertante (se necessário)
) {
    // Construtor para mapear da entidade Carona para o DTO
    public CaronaDTO(Carona carona) {
        this(
            carona.getId(),
            carona.getOrigem(),
            carona.getDestino(),
            carona.getData(),
            carona.getHorario(),
            carona.getVagas(),
            carona.getDescricao(),
            carona.getOfertante() != null ? carona.getOfertante().getNome() : "Desconhecido", // Pega o nome do ofertante
            carona.getOfertante() != null ? carona.getOfertante().getId() : null,
            carona.getOfertante() != null ? carona.getOfertante().getTipo() : null
        );
    }
}

// OfertanteDTO para AvaliacaoCaronaDTO (se necessário)
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

// AvaliacaoCaronaDTO para retornar avaliações formatadas
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
