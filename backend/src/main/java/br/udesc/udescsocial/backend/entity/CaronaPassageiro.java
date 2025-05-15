/**
 * Classe CaronaPassageiro
 * 
 * Author: Elian
 * Data: 2025-05-15
 */

package br.udesc.udescsocial.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
public class CaronaPassageiro {
    @EmbeddedId
    private CaronaPassageiroId id;
    
    @Column(nullable = false)
    private LocalDate dataCadastro;
    
    @ManyToOne
    @MapsId("caronaId")
    @JoinColumn(name = "carona_id")
    private Carona carona;
    
    @ManyToOne
    @MapsId("passageiroId")
    @JoinColumn(name = "passageiro_id")
    private Usuario passageiro;

    // Getters e Setters
    public CaronaPassageiroId getId() {
        return id;
    }

    public void setId(CaronaPassageiroId id) {
        this.id = id;
    }

    public LocalDate getDataCadastro() {
        return dataCadastro;
    }

    public void setDataCadastro(LocalDate dataCadastro) {
        this.dataCadastro = dataCadastro;
    }

    public Carona getCarona() {
        return carona;
    }

    public void setCarona(Carona carona) {
        this.carona = carona;
    }

    public Usuario getPassageiro() {
        return passageiro;
    }

    public void setPassageiro(Usuario passageiro) {
        this.passageiro = passageiro;
    }
}