package br.udesc.udescsocial.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity 
public class Anuncio {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "autor_id", nullable = false)
    private Usuario autor;
    
    @Column(nullable = false)
    private String titulo;
    
    @Column(nullable = false)
    private String tipo;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String descricao;
    
    @Column(nullable = false)
    private String local;
    
    private Integer quantidade;
    
    @Column(nullable = false)
    private LocalDate dataPublicacao;
    
    @OneToMany(mappedBy = "anuncio", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference 
    private List<AnuncioFoto> fotos;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Usuario getAutor() {
        return autor;
    }

    public void setAutor(Usuario autor) {
        this.autor = autor;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public String getLocal() {
        return local;
    }

    public void setLocal(String local) {
        this.local = local;
    }

    public Integer getQuantidade() {
        return quantidade;
    }

    public void setQuantidade(Integer quantidade) {
        this.quantidade = quantidade;
    }

    public LocalDate getDataPublicacao() {
        return dataPublicacao;
    }

    public void setDataPublicacao(LocalDate dataPublicacao) {
        this.dataPublicacao = dataPublicacao;
    }

    public List<AnuncioFoto> getFotos() {
        return fotos;
    }

    public void setFotos(List<AnuncioFoto> fotos) {
        this.fotos = fotos;
    }
}