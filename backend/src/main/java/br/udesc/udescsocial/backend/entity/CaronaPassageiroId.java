/**
 * Classe CaronaPassageiroId
 * 
 * Author: Elian
 * Data: 2025-05-15
 */

package br.udesc.udescsocial.backend.entity;

import jakarta.persistence.Embeddable;
import java.io.Serializable;

@Embeddable
public class CaronaPassageiroId implements Serializable {
    private Long caronaId;
    private Long passageiroId;

    public CaronaPassageiroId() {
    }

    public CaronaPassageiroId(Long caronaId, Long passageiroId) {
        this.caronaId = caronaId;
        this.passageiroId = passageiroId;
    }

    public Long getCaronaId() {
        return caronaId;
    }

    public void setCaronaId(Long caronaId) {
        this.caronaId = caronaId;
    }

    public Long getPassageiroId() {
        return passageiroId;
    }

    public void setPassageiroId(Long passageiroId) {
        this.passageiroId = passageiroId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        
        CaronaPassageiroId that = (CaronaPassageiroId) o;
        
        if (!caronaId.equals(that.caronaId)) return false;
        return passageiroId.equals(that.passageiroId);
    }

    @Override
    public int hashCode() {
        int result = caronaId.hashCode();
        result = 31 * result + passageiroId.hashCode();
        return result;
    }
}