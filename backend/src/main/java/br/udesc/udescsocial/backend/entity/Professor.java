package br.udesc.udescsocial.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

@Entity
@Table(name = "professor",
       uniqueConstraints = @UniqueConstraint(name = "uk_professor_usuario", columnNames = "usuario_id"))
public class Professor {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "usuario_id", referencedColumnName = "id", 
               foreignKey = @ForeignKey(name = "fk_professor_usuario"))
    private Usuario usuario;

    @NotBlank(message = "Departamento é obrigatório")
    @Size(max = 100, message = "Departamento deve ter no máximo 100 caracteres")
    @Column(nullable = false, length = 100)
    private String departamento;

    // Construtor padrão
    public Professor() {}

    // Construtor com campos obrigatórios
    public Professor(Usuario usuario, String departamento) {
        setUsuario(usuario); // Usa o setter para validação
        this.departamento = departamento;
    }

    // Getters e Setters com validação
    public Long getId() {
        return id;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        if (usuario == null) {
            throw new IllegalArgumentException("Usuário não pode ser nulo");
        }
        if (!"PROFESSOR".equals(usuario.getTipo())) {
            throw new IllegalArgumentException("O usuário deve ser do tipo PROFESSOR");
        }
        this.usuario = usuario;
    }

    public String getDepartamento() {
        return departamento;
    }

    public void setDepartamento(String departamento) {
        if (departamento == null || departamento.trim().isEmpty()) {
            throw new IllegalArgumentException("Departamento não pode ser vazio");
        }
        this.departamento = departamento;
    }
}