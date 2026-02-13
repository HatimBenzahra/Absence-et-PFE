package com.isty.service.projets;

import com.isty.dto.projets.LivrableCreateDTO;
import com.isty.dto.projets.LivrableDTO;
import com.isty.entity.projets.AffectationPFE;
import com.isty.entity.projets.Livrable;
import com.isty.entity.projets.StatutAffectation;
import com.isty.exception.BadRequestException;
import com.isty.exception.ResourceNotFoundException;
import com.isty.repository.projets.AffectationPFERepository;
import com.isty.repository.projets.LivrableRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LivrableService {

    private final LivrableRepository livrableRepository;
    private final AffectationPFERepository affectationRepository;

    @Transactional
    public LivrableDTO deposerLivrable(LivrableCreateDTO dto, Long affectationId) {
        AffectationPFE affectation = affectationRepository.findById(affectationId)
                .orElseThrow(() -> new ResourceNotFoundException("Affectation non trouvee avec l'id: " + affectationId));

        if (affectation.getStatut() != StatutAffectation.EN_COURS) {
            throw new BadRequestException("Impossible de deposer un livrable pour une affectation qui n'est plus en cours");
        }

        Livrable livrable = Livrable.builder()
                .type(dto.getType())
                .titre(dto.getTitre())
                .urlFichier(dto.getUrlFichier())
                .commentaire(dto.getCommentaire())
                .affectation(affectation)
                .build();

        livrable = livrableRepository.save(livrable);
        return toDTO(livrable);
    }

    public List<LivrableDTO> getLivrablesForAffectation(Long affectationId) {
        return livrableRepository.findByAffectationId(affectationId)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    private LivrableDTO toDTO(Livrable livrable) {
        return LivrableDTO.builder()
                .id(livrable.getId())
                .type(livrable.getType())
                .titre(livrable.getTitre())
                .urlFichier(livrable.getUrlFichier())
                .dateDepot(livrable.getDateDepot())
                .build();
    }
}
