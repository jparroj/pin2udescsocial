package br.udesc.udescsocial.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
public class AvaliacaoCarona {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "carona_id", nullable = false)
    private Carona carona;
    
    @ManyToOne
    @JoinColumn(name = "avaliador_id", nullable = false)
    private Usuario avaliador;
    
    @ManyToOne
    @JoinColumn(name = "avaliado_id", nullable = false)
    private Usuario avaliado;
    
    @Column(nullable = false)
    private String nota;
    
    private String comentario;
    
    @Column(nullable = false)
    private LocalDate dataAvaliacao;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Carona getCarona() {
        return carona;
    }

    public void setCarona(Carona carona) {
        this.carona = carona;
    }

    public Usuario getAvaliador() {
        return avaliador;
    }

    public void setAvaliador(Usuario avaliador) {
        this.avaliador = avaliador;
    }

    public Usuario getAvaliado() {
        return avaliado;
    }

    public void setAvaliado(Usuario avaliado) {
        this.avaliado = avaliado;
    }

    public String getNota() {
        return nota;
    }

    public void setNota(String nota) {
        this.nota = nota;
    }

    public String getComentario() {
        return comentario;
    }

    public void setComentario(String comentario) {
        this.comentario = comentario;
    }

    public LocalDate getDataAvaliacao() {
        return dataAvaliacao;
    }

    public void setDataAvaliacao(LocalDate dataAvaliacao) {
        this.dataAvaliacao = dataAvaliacao;
    }
}