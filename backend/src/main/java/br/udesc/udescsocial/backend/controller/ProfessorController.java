/**
 * Classe ProfessorController
 * 
 * Usuario: Lucas Eduardo

 */

package br.udesc.udescsocial.backend.controller;

import br.udesc.udescsocial.backend.entity.Professor;
import br.udesc.udescsocial.backend.repository.ProfessorRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/professor")
@CrossOrigin(origins = "*")
public class ProfessorController {

    private final ProfessorRepository repository;

    public ProfessorController(ProfessorRepository repository) {
        this.repository = repository;
    }

    @PostMapping
    public Professor cadastrar(@RequestBody Professor professor) {
        return repository.save(professor);
    }

    @GetMapping
    public List<Professor> listarTodos() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public Professor buscarPorId(@PathVariable Long id) {
        return repository.findById(id).orElse(null);
    }
}