package com.isty.service.projets;

import com.isty.dto.projets.SoutenanceCreateDTO;
import com.isty.dto.projets.SoutenanceDTO;
import com.isty.entity.projets.AffectationPFE;
import com.isty.entity.projets.Soutenance;
import com.isty.exception.ResourceNotFoundException;
import com.isty.repository.projets.AffectationPFERepository;
import com.isty.repository.projets.SoutenanceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SoutenanceService {

    private final SoutenanceRepository soutenanceRepository;
    private final AffectationPFERepository affectationRepository;

    @Transactional
    public SoutenanceDTO planifier(SoutenanceCreateDTO dto) {
        AffectationPFE affectation = affectationRepository.findById(dto.getAffectationId())
                .orElseThrow(() -> new ResourceNotFoundException("Affectation non trouvee avec l'id: " + dto.getAffectationId()));

        Soutenance soutenance = Soutenance.builder()
                .affectation(affectation)
                .dateSoutenance(dto.getDateSoutenance())
                .lieu(dto.getLieu())
                .jury(dto.getJury())
                .build();

        soutenance = soutenanceRepository.save(soutenance);
        return toDTO(soutenance);
    }

    public List<SoutenanceDTO> getAll() {
        return soutenanceRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<SoutenanceDTO> getByAffectation(Long affectationId) {
        return soutenanceRepository.findByAffectationId(affectationId)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public void delete(Long id) {
        if (!soutenanceRepository.existsById(id)) {
            throw new ResourceNotFoundException("Soutenance non trouvee avec l'id: " + id);
        }
        soutenanceRepository.deleteById(id);
    }

    private SoutenanceDTO toDTO(Soutenance soutenance) {
        AffectationPFE affectation = soutenance.getAffectation();
        String etudiantNom = affectation.getEtudiant().getNom() + " " + affectation.getEtudiant().getPrenom();
        String sujetTitre = affectation.getSujet().getTitre();

        return SoutenanceDTO.builder()
                .id(soutenance.getId())
                .affectationId(affectation.getId())
                .etudiantNom(etudiantNom)
                .sujetTitre(sujetTitre)
                .dateSoutenance(soutenance.getDateSoutenance())
                .lieu(soutenance.getLieu())
                .jury(soutenance.getJury())
                .observations(soutenance.getObservations())
                .build();
    }
}
