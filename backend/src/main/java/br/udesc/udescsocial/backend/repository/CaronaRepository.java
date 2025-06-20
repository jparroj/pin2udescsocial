// backend/src/main/java/br/udesc/udescsocial/backend/repository/CaronaRepository.java
package br.udesc.udescsocial.backend.repository;

import br.udesc.udescsocial.backend.entity.Carona;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.util.List;

public interface CaronaRepository extends JpaRepository<Carona, Long> {

    @Query("SELECT c FROM Carona c WHERE " +
            "(:#{#origem == null} = true OR c.origem = :origem) AND " +
            "(:#{#destino == null} = true OR c.destino = :destino) AND " +
            "(:#{#data == null} = true OR c.data = :data)")
    List<Carona> findWithFilters(
        @Param("origem") String origem,
        @Param("destino") String destino,
        @Param("data") LocalDate data);

    // NOVO MÉTODO: Para listar caronas com vagas disponíveis
    List<Carona> findByVagasGreaterThan(Integer vagas);
}
