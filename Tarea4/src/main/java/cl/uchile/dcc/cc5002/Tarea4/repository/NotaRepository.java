package cl.uchile.dcc.cc5002.Tarea4.repository;

import cl.uchile.dcc.cc5002.Tarea4.model.Nota;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface NotaRepository extends JpaRepository<Nota, Integer> {

    List<Nota> findByAvistamientoId(Integer avistamientoId);

    @Query("SELECT AVG(n.nota) FROM Nota n WHERE n.avistamientoId = :avistamientoId")
    Double promedioPorAvistamiento(@Param("avistamientoId") Integer avistamientoId);
}