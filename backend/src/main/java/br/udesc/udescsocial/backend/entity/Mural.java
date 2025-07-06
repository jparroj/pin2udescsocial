package br.udesc.udescsocial.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
public class Mural {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "autor_id", nullable = false)
    private Professor autor;
    
    @Column(nullable = false)
    private String titulo;
    
    @Column(nullable = false)
    private String categoria;
    
    @Lob
    @Column(nullable = false, columnDefinition = "TEXT")
    @Basic(fetch = FetchType.EAGER)
    private String conteudo;
    
    @Column(nullable = false)
    private LocalDate dataPublicacao;
    
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Professor getAutor() {
        return autor;
    }

    public void setAutor(Professor autor) {
        this.autor = autor;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getCategoria() {
        return categoria;
    }

    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }

    public String getConteudo() {
        return conteudo;
    }

    public void setConteudo(String conteudo) {
        this.conteudo = conteudo;
    }

    public LocalDate getDataPublicacao() {
        return dataPublicacao;
    }

    public void setDataPublicacao(LocalDate dataPublicacao) {
        this.dataPublicacao = dataPublicacao;
    }
}
