package cz.itnetwork.entity.repository.specification;

import cz.itnetwork.entity.PersonEntity;
import cz.itnetwork.entity.filter.PersonFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import jakarta.persistence.criteria.*;
import java.util.ArrayList;
import java.util.List;

@RequiredArgsConstructor
public class PersonSpecification implements Specification<PersonEntity> {

    // Filter object containing the search criteria
    private final PersonFilter filter;

    /**
     * Builds a dynamic WHERE clause based on the PersonFilter.
     * Now supports only filtering by identification number.
     */
    @Override
    public Predicate toPredicate(Root<PersonEntity> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {
        List<Predicate> predicates = new ArrayList<>();

        // If an identification number is provided, add it to the WHERE clause
        if (filter.getIdentificationNumber() != null && !filter.getIdentificationNumber().isEmpty()) {
            predicates.add(criteriaBuilder.equal(root.get("identificationNumber"), filter.getIdentificationNumber()));
        }

        return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
    }
}
