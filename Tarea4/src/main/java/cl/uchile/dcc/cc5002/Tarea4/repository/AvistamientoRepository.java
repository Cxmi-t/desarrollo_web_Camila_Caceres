package cl.uchile.dcc.cc5002.Tarea4.repository;

import cl.uchile.dcc.cc5002.Tarea4.model.Avistamiento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AvistamientoRepository extends JpaRepository<Avistamiento, Integer> {

    @Query("""
        SELECT a FROM Avistamiento a
        JOIN a.ave av
        JOIN a.voluntario v
        JOIN v.comuna c
        WHERE (:q IS NULL OR :q = ''
           OR LOWER(av.nombre) LIKE LOWER(CONCAT('%', :q, '%'))
           OR LOWER(a.lugar) LIKE LOWER(CONCAT('%', :q, '%'))
           OR LOWER(a.tipo) LIKE LOWER(CONCAT('%', :q, '%'))
           OR LOWER(c.nombre) LIKE LOWER(CONCAT('%', :q, '%'))
           OR LOWER(v.nombre) LIKE LOWER(CONCAT('%', :q, '%'))
           OR LOWER(v.apellido) LIKE LOWER(CONCAT('%', :q, '%')))
        ORDER BY a.fechaHora DESC
        """)
    List<Avistamiento> buscar(@Param("q") String q);
}