package br.udesc.udescsocial.backend.controller;

import br.udesc.udescsocial.backend.entity.Mural;
import java.time.LocalDate;

public class MuralResponseDTO {
    private Long id;
    private String titulo;
    private String categoria;
    private String conteudo;
    private String autorNome;
    private LocalDate dataPublicacao;

    public MuralResponseDTO(Mural mural) {
        this.id = mural.getId();
        this.titulo = mural.getTitulo();
        this.categoria = mural.getCategoria();
        this.conteudo = mural.getConteudo(); // Acessando o campo LAZY aqui

        // Acessando o campo LAZY do autor e, em seguida, do usuário
        if (mural.getAutor() != null && mural.getAutor().getUsuario() != null) {
            this.autorNome = mural.getAutor().getUsuario().getNome();
        } else {
            this.autorNome = "Desconhecido";
        }
        this.dataPublicacao = mural.getDataPublicacao();
    }

    public Long getId() { return id; }
    public String getTitulo() { return titulo; }
    public String getCategoria() { return categoria; }
    public String getConteudo() { return conteudo; }
    public String getAutorNome() { return autorNome; }
    public LocalDate getDataPublicacao() { return dataPublicacao; }
}
