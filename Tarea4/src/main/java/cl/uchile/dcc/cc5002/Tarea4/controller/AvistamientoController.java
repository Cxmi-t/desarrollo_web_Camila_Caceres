package cl.uchile.dcc.cc5002.Tarea4.controller;

import cl.uchile.dcc.cc5002.Tarea4.model.Avistamiento;
import cl.uchile.dcc.cc5002.Tarea4.model.Nota;
import cl.uchile.dcc.cc5002.Tarea4.repository.AvistamientoRepository;
import cl.uchile.dcc.cc5002.Tarea4.repository.NotaRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
public class AvistamientoController {

    private final AvistamientoRepository avistamientoRepository;
    private final NotaRepository notaRepository;

    public AvistamientoController(AvistamientoRepository avistamientoRepository,
                                  NotaRepository notaRepository) {
        this.avistamientoRepository = avistamientoRepository;
        this.notaRepository = notaRepository;
    }

    @GetMapping("/")
    public String listado(@RequestParam(value = "q", required = false) String q, Model model) {
        List<Avistamiento> avistamientos = avistamientoRepository.buscar(q);
        Map<Integer, Double> promedios = new HashMap<>();

        for (Avistamiento av : avistamientos) {
            Double avg = notaRepository.promedioPorAvistamiento(av.getId());
            promedios.put(av.getId(), avg != null ? Math.round(avg * 10.0) / 10.0 : 0.0);
        }

        model.addAttribute("avistamientos", avistamientos);
        model.addAttribute("promedios", promedios);
        model.addAttribute("q", q != null ? q : "");
        return "index";
    }

    @GetMapping("/api/avistamientos")
    @ResponseBody
    public List> buscarApi(@RequestParam(value = "q", required = false) String q) {
        return avistamientoRepository.buscar(q).stream().map(av -> {
            Double avg = notaRepository.promedioPorAvistamiento(av.getId());
            double promedioRedondeado = avg != null ? Math.round(avg * 10.0) / 10.0 : 0.0;

            Map<String, Object> item = new HashMap<>();
            item.put("id", av.getId());
            item.put("ave", av.getAve() != null ? av.getAve().getNombre() : "");
            item.put("tipo", av.getTipo());
            item.put("lugar", av.getLugar());
            item.put("comuna", (av.getVoluntario() != null && av.getVoluntario().getComuna() != null)
                    ? av.getVoluntario().getComuna().getNombre() : "");
            item.put("voluntario", av.getVoluntario() != null
                    ? av.getVoluntario().getNombre() + " " + av.getVoluntario().getApellido() : "");
            item.put("fechaHora", av.getFechaHora() != null ? av.getFechaHora().toString() : "");
            item.put("promedio", promedioRedondeado);
            return item;
        }).toList();
    }

    @PostMapping("/api/avistamientos/{id}/notas")
    @ResponseBody
    public ResponseEntity<?> agregarNota(@PathVariable Integer id, @RequestBody Map<String, Object> body) {
        if (!avistamientoRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        Object rawNota = body.get("nota");
        int valorNota;
        try {
            valorNota = Integer.parseInt(String.valueOf(rawNota).trim());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "La nota debe ser un número entero entre 1 y 7."));
        }

        if (valorNota < 1 || valorNota > 7) {
            return ResponseEntity.badRequest().body(Map.of("error", "La nota debe estar entre 1 y 7."));
        }

        Nota nuevaNota = new Nota();
        nuevaNota.setAvistamientoId(id);
        nuevaNota.setNota(valorNota);
        notaRepository.save(nuevaNota);

        Double avg = notaRepository.promedioPorAvistamiento(id);
        double promedioRedondeado = avg != null ? Math.round(avg * 10.0) / 10.0 : 0.0;

        return ResponseEntity.ok(Map.of(
                "avistamientoId", id,
                "notaAgregada", valorNota,
                "promedio", promedioRedondeado
        ));
    }
}