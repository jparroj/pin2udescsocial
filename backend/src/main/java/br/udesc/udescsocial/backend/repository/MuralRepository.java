/**
 * Classe Mural Repository
 * 
 * Usuario: Lucas Eduardo
 
 */

package br.udesc.udescsocial.backend.repository;

import br.udesc.udescsocial.backend.entity.Mural;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MuralRepository extends JpaRepository<Mural, Long> {

// Listar todos os murais por data de publicação, os mais recentes vem primeiro.
List<Mural> findAllByOrderByDataPublicacaoDesc();

 // Listar murais pelo Autor
List<Mural> findByAutorUsuarioIdOrderByDataPublicacaoDesc(Long autorId);
}