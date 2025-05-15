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
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/caronas")
@CrossOrigin(origins = "*")
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
    
    // Ofertar carona (ID 07 do backlog)
    @PostMapping("/ofertar")
    public ResponseEntity<Carona> ofertarCarona(@RequestBody OfertarCaronaRequest request) {
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
        return ResponseEntity.ok(saved);
    }
    
    // Procurar caronas (ID 06 do backlog)
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
        
        return ResponseEntity.ok(caronas);
        
    } catch (Exception ex) {
        return ResponseEntity.internalServerError()
                .body("Erro ao buscar caronas: " + ex.getMessage());
    }
    }
    
    // Cadastrar passageiro em carona
   @PostMapping("/{caronaId}/passageiros/{passageiroId}")
    public ResponseEntity<?> adicionarPassageiro(
        @PathVariable Long caronaId,
        @PathVariable Long passageiroId) {
    
    try {
        Carona carona = caronaRepository.findById(caronaId)
                .orElseThrow(() -> new EntityNotFoundException("Carona não encontrada"));
                
        Usuario passageiro = usuarioRepository.findById(passageiroId)
                .orElseThrow(() -> new EntityNotFoundException("Passageiro não encontrado"));

        if (caronaPassageiroRepository.existsById(new CaronaPassageiroId(caronaId, passageiroId))) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Passageiro já está nesta carona");
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
    
    // Avaliar carona (ID 08 do backlog)
    @PostMapping("/avaliar")
    public ResponseEntity<AvaliacaoCarona> avaliarCarona(@RequestBody AvaliarCaronaRequest request) {
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
        return ResponseEntity.ok(saved);
    }
    
    // Listar avaliações recebidas por um usuário
    @GetMapping("/avaliacoes/recebidas/{usuarioId}")
    public ResponseEntity<?> getAvaliacoesRecebidas(@PathVariable Long usuarioId) {
    if (!usuarioRepository.existsById(usuarioId)) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body("Usuário não encontrado com ID: " + usuarioId);
    }
    
    List<AvaliacaoCarona> avaliacoes = avaliacaoCaronaRepository.findByAvaliadoId(usuarioId);
    return ResponseEntity.ok(avaliacoes);
    }

    // Listar avaliações feitas por um usuário
    @GetMapping("/avaliacoes/feitas/{usuarioId}")
    public ResponseEntity<List<AvaliacaoCarona>> getAvaliacoesFeitas(@PathVariable Long usuarioId) {
        List<AvaliacaoCarona> avaliacoes = avaliacaoCaronaRepository.findByAvaliadorId(usuarioId);
        return ResponseEntity.ok(avaliacoes);
    }
    
    // Criar alerta de carona (parte do ID 06 do backlog)
    @PostMapping("/alerta")
    public ResponseEntity<Void> criarAlertaCarona(@RequestBody AlertaCaronaRequest request) {
        // Implementação simplificada - em produção, integrar com sistema de notificações
        return ResponseEntity.ok().build();
    }
}

// Classes de request (DTOs)
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
    
    @Min(value = 1, message = "Deve ter pelo menos 1 vaga")
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