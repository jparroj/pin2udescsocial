package br.udesc.udescsocial.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity  //indica que esta classe é uma entidade persistente que será mapeada para uma tabela no banco de dados.
public class Anuncio {
    @Id //marca este campo como chave primária
    @GeneratedValue(strategy = GenerationType.IDENTITY)//com estratégia IDENTITY significa que o valor será gerado automaticamente pelo banco de dados
    private Long id;
    
    @ManyToOne//indica um relacionamento muitos-para-um: muitos anúncios podem pertencer a um usuário
    @JoinColumn(name = "autor_id", nullable = false) //especifica a coluna de junção no banco de dados (autor_id) e que não pode ser nula
    private Usuario autor;
    
    @Column(nullable = false)
    private String titulo;
    
    @Column(nullable = false)
    private String tipo; // MATERIAL, AULA, ALUGUEL, EVENTO
    
    @Column(nullable = false, columnDefinition = "TEXT")//TEXT para a descrição permite textos longos
    private String descricao;
    
    @Column(nullable = false)
    private String local;
    
    private Integer quantidade;
    
    @Column(nullable = false)
    private LocalDate dataPublicacao;
    

    //@OneToMany indica que um anúncio pode ter várias fotos
    //mappedBy especifica que o relacionamento é bidirecional, mapeado pelo campo "anuncio" na classe AnuncioFoto
    //cascade = CascadeType.ALL significa que operações no anúncio afetam as fotos (se deletar anúncio, deleta fotos)
    //orphanRemoval = true remove fotos "órfãs" (quando removidas da lista)
    //@JsonIgnore evita serialização JSON infinita (quando transforma em JSON)
    @OneToMany(mappedBy = "anuncio", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference 
    private List<AnuncioFoto> fotos;

    // Getters e Setters
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