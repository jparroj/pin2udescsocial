/**
 * Classe CaronaController
 *
 * Author: Elian
 * Data: 2025-05-15
 */
package br.udesc.udescsocial.backend.controller;

import br.udesc.udescsocial.backend.entity.*;
import br.udesc.udescsocial.backend.repository.*;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;


import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/caronas")
//@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class CaronaController {

    private final CaronaRepository caronaRepository;
    private final UsuarioRepository usuarioRepository;
    private final CaronaPassageiroRepository caronaPassageiroRepository;
    private final AvaliacaoCaronaRepository avaliacaoCaronaRepository;

    public CaronaController(CaronaRepository caronaRepository,
                            UsuarioRepository usuarioRepository,
                            CaronaPassageiroRepository caronaPassageiroRepository,
                            AvaliacaoCaronaRepository avaliacaoCaronaRepository) {
        this.caronaRepository = caronaRepository;
        this.usuarioRepository = usuarioRepository;
        this.caronaPassageiroRepository = caronaPassageiroRepository;
        this.avaliacaoCaronaRepository = avaliacaoCaronaRepository;
    }

    @PostMapping("/ofertar")
    public ResponseEntity<CaronaDTO> ofertarCarona(@RequestBody OfertarCaronaRequest request) {
        Optional<Usuario> ofertanteOpt = usuarioRepository.findById(request.ofertanteId());
        if (ofertanteOpt.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        Carona carona = new Carona();
        carona.setOfertante(ofertanteOpt.get());
        carona.setOrigem(request.origem());
        carona.setDestino(request.destino());
        carona.setData(request.data());
        carona.setHorario(request.horario());
        carona.setVagas(request.vagas());
        carona.setDescricao(request.descricao());

        Carona saved = caronaRepository.save(carona);
        return ResponseEntity.ok(new CaronaDTO(saved));
    }

    @GetMapping("/procurar")
    public ResponseEntity<?> procurarCaronas(
            @RequestParam(required = false) String origem,
            @RequestParam(required = false) String destino,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate data) {

        try {
            List<Carona> caronas = caronaRepository.findWithFilters(origem, destino, data);

            if (caronas.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Nenhuma carona encontrada com os critérios especificados");
            }

            List<CaronaDTO> caronaDTOs = caronas.stream()
                                                .map(CaronaDTO::new)
                                                .collect(Collectors.toList());

            return ResponseEntity.ok(caronaDTOs);
        } catch (Exception ex) {
            return ResponseEntity.internalServerError()
                    .body("Erro ao buscar caronas: " + ex.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<CaronaDTO>> listarTodasCaronasDisponiveis() {
        List<Carona> caronas = caronaRepository.findByVagasGreaterThan(0);
        List<CaronaDTO> caronaDTOs = caronas.stream()
                                                .map(CaronaDTO::new)
                                                .collect(Collectors.toList());
        return ResponseEntity.ok(caronaDTOs);
    }

    @PostMapping("/{caronaId}/passageiros/{passageiroId}")
    public ResponseEntity<?> adicionarPassageiro(
            @PathVariable Long caronaId,
            @PathVariable Long passageiroId) {

        try {
            Carona carona = caronaRepository.findById(caronaId)
                    .orElseThrow(() -> new EntityNotFoundException("Carona não encontrada"));

            Usuario passageiro = usuarioRepository.findById(passageiroId)
                    .orElseThrow(() -> new EntityNotFoundException("Passageiro não encontrado"));

            if (caronaPassageiroRepository.findByCaronaIdAndPassageiroId(caronaId, passageiroId).isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body("Passageiro já está nesta carona");
            }
            
            if (carona.getOfertante().getId().equals(passageiroId)) {
                return ResponseEntity.badRequest()
                        .body("Ofertante não pode se adicionar como passageiro na própria carona.");
            }


            if (carona.getVagas() <= 0) {
                return ResponseEntity.badRequest()
                        .body("Não há vagas disponíveis nesta carona");
            }

            CaronaPassageiro relacao = new CaronaPassageiro();
            relacao.setId(new CaronaPassageiroId(caronaId, passageiroId));
            relacao.setCarona(carona);
            relacao.setPassageiro(passageiro);
            relacao.setDataCadastro(LocalDate.now());

            caronaPassageiroRepository.save(relacao);

            carona.setVagas(carona.getVagas() - 1);
            caronaRepository.save(carona);

            return ResponseEntity.ok().build();

        } catch (EntityNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ex.getMessage());
        } catch (Exception ex) {
            return ResponseEntity.internalServerError()
                    .body("Erro ao adicionar passageiro: " + ex.getMessage());
        }
    }

    @PostMapping("/avaliar")
    public ResponseEntity<AvaliacaoCaronaDTO> avaliarCarona(@RequestBody AvaliarCaronaRequest request) {
        Optional<Carona> caronaOpt = caronaRepository.findById(request.caronaId());
        Optional<Usuario> avaliadorOpt = usuarioRepository.findById(request.avaliadorId());
        Optional<Usuario> avaliadoOpt = usuarioRepository.findById(request.avaliadoId());

        if (caronaOpt.isEmpty() || avaliadorOpt.isEmpty() || avaliadoOpt.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        AvaliacaoCarona avaliacao = new AvaliacaoCarona();
        avaliacao.setCarona(caronaOpt.get());
        avaliacao.setAvaliador(avaliadorOpt.get());
        avaliacao.setAvaliado(avaliadoOpt.get());
        avaliacao.setNota(request.nota());
        avaliacao.setComentario(request.comentario());
        avaliacao.setDataAvaliacao(LocalDate.now());

        AvaliacaoCarona saved = avaliacaoCaronaRepository.save(avaliacao);
        return ResponseEntity.ok(new AvaliacaoCaronaDTO(saved));
    }

    @GetMapping("/avaliacoes/recebidas/{usuarioId}")
    public ResponseEntity<?> getAvaliacoesRecebidas(@PathVariable Long usuarioId) {
        if (!usuarioRepository.existsById(usuarioId)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Usuário não encontrado com ID: " + usuarioId);
        }

        List<AvaliacaoCarona> avaliacoes = avaliacaoCaronaRepository.findByAvaliadoId(usuarioId);
        List<AvaliacaoCaronaDTO> avaliacaoDTOs = avaliacoes.stream()
                                                            .map(AvaliacaoCaronaDTO::new)
                                                            .collect(Collectors.toList());
        return ResponseEntity.ok(avaliacaoDTOs);
    }

    @GetMapping("/avaliacoes/feitas/{usuarioId}")
    public ResponseEntity<List<AvaliacaoCaronaDTO>> getAvaliacoesFeitas(@PathVariable Long usuarioId) {
        List<AvaliacaoCarona> avaliacoes = avaliacaoCaronaRepository.findByAvaliadorId(usuarioId);
        List<AvaliacaoCaronaDTO> avaliacaoDTOs = avaliacoes.stream()
                                                            .map(AvaliacaoCaronaDTO::new)
                                                            .collect(Collectors.toList());
        return ResponseEntity.ok(avaliacaoDTOs);
    }

    @PostMapping("/alerta")
    public ResponseEntity<Void> criarAlertaCarona(@RequestBody AlertaCaronaRequest request) {
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    @Transactional
    public ResponseEntity<?> atualizarCarona(@PathVariable Long id, @RequestBody AtualizarCaronaRequest request) {
        try {
            Optional<Carona> caronaOpt = caronaRepository.findById(id);
            if (caronaOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Carona carona = caronaOpt.get();

            if (!carona.getOfertante().getId().equals(request.ofertanteId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Você não tem permissão para atualizar esta carona.");
            }

            if (request.origem() != null && !request.origem().isBlank()) {
                carona.setOrigem(request.origem());
            }
            if (request.destino() != null && !request.destino().isBlank()) {
                carona.setDestino(request.destino());
            }
            if (request.data() != null) {
                carona.setData(request.data());
            }
            if (request.horario() != null) {
                carona.setHorario(request.horario());
            }
            if (request.vagas() != null && request.vagas() >= 0) {
                carona.setVagas(request.vagas());
            }
            if (request.descricao() != null) {
                carona.setDescricao(request.descricao());
            }

            Carona updatedCarona = caronaRepository.save(carona);
            return ResponseEntity.ok(new CaronaDTO(updatedCarona));

        } catch (Exception ex) {
            return ResponseEntity.internalServerError()
                    .body("Erro ao atualizar carona: " + ex.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<?> deletarCarona(@PathVariable Long id, @RequestParam Long ofertanteId) {
        try {
            Optional<Carona> caronaOpt = caronaRepository.findById(id);
            if (caronaOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Carona carona = caronaOpt.get();
    
            if (!carona.getOfertante().getId().equals(ofertanteId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Você não tem permissão para deletar esta carona.");
            }

            caronaRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (Exception ex) {
            return ResponseEntity.internalServerError()
                    .body("Erro ao deletar carona: " + ex.getMessage());
        }
    }
}

record OfertarCaronaRequest(
    @NotNull(message = "ID do ofertante é obrigatório")
    Long ofertanteId,
    @NotBlank(message = "Origem é obrigatória")
    String origem,
    @NotBlank(message = "Destino é obrigatório")
    String destino,
    @FutureOrPresent(message = "Data deve ser atual ou futura")
    LocalDate data,
    @NotNull(message = "Horário é obrigatório")
    LocalTime horario,
    @Min(value = 0, message = "Vagas deve ser pelo menos 0")
    Integer vagas,
    String descricao
) {}

record AtualizarCaronaRequest(
    @NotNull(message = "ID do ofertante é obrigatório")
    Long ofertanteId, 
    String origem,
    String destino,
    LocalDate data,
    LocalTime horario,
    Integer vagas,
    String descricao
) {}

record AvaliarCaronaRequest(
    Long caronaId,
    Long avaliadorId,
    Long avaliadoId,
    String nota,
    String comentario
) {}

record AlertaCaronaRequest(
    Long usuarioId,
    String origem,
    String destino,
    LocalDate data
) {}
