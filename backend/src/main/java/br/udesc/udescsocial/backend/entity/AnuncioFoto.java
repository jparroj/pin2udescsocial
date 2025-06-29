package br.udesc.udescsocial.backend.entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity// indica que esta classe é uma entidade persistente que será mapeada para uma tabela no banco de dados.
public class AnuncioFoto {
    @Id//marca o campo como chave primária
    @GeneratedValue(strategy = GenerationType.IDENTITY)// com estratégia IDENTITY significa que o valor será gerado automaticamente pelo banco de dado
    private Long id;
    
    @ManyToOne//Indica que muitas fotos podem pertencer a um anúncio
    @JoinColumn(name = "anuncio_id", nullable = false)//Especifica o nome da coluna de junção (anuncio_id) 
    @JsonBackReference
    private Anuncio anuncio;                        
                                                    
    
    @Column(nullable = false)//nullable = false indica que é um campo obrigatório
    private String urlImagem;//Armazena o caminho/URL da imagem

    // Getters e Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Anuncio getAnuncio() {
        return anuncio;
    }

    public void setAnuncio(Anuncio anuncio) {
        this.anuncio = anuncio;
    }

    public String getUrlImagem() {
        return urlImagem;
    }

    public void setUrlImagem(String urlImagem) {
        this.urlImagem = urlImagem;
    }
}