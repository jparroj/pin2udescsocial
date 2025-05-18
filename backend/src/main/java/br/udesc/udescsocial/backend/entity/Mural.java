/**
 * Classe Mural
* Usuário Lucas Eduardo
 * Data: 2025-05-16
 */
package br.udesc.udescsocial.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
public class Mural {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDate dataPublicacao;

    @Column(nullable = false, length = 100)
    private String titulo;

    @Column(nullable = false, length = 50)
    private String categoria; 

    @Lob
    @Column(nullable = false)
    private String conteudo;

    @ManyToOne
    @JoinColumn(name = "autor_id", nullable = false)
    private Professor autor;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getDataPublicacao() {
        return dataPublicacao;
    }

    public void setDataPublicacao(LocalDate dataPublicacao) {
        this.dataPublicacao = dataPublicacao;
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

    public Professor getAutor() {
        return autor;
    }

    public void setAutor(Professor autor) {
        this.autor = autor;
    }

}