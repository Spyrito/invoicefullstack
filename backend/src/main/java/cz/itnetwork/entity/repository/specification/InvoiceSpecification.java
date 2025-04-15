package cz.itnetwork.entity.repository.specification;

import cz.itnetwork.entity.InvoiceEntity;
import cz.itnetwork.entity.filter.InvoiceFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import jakarta.persistence.criteria.*;
import java.util.ArrayList;
import java.util.List;

@RequiredArgsConstructor
public class InvoiceSpecification implements Specification<InvoiceEntity> {

    // The filter containing user-defined search parameters
    private final InvoiceFilter filter;

    @Override
    public Predicate toPredicate(Root<InvoiceEntity> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {
        List<Predicate> predicates = new ArrayList<>();

        // Filter by minimum price if set
        if (filter.getFromPrice() != null) {
            predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("price"), filter.getFromPrice()));
        }

        // Filter by maximum price if set
        if (filter.getToPrice() != null) {
            predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("price"), filter.getToPrice()));
        }

        // Filter by seller ID if set and greater than 0
        if (filter.getSellerID() != null && filter.getSellerID() > 0) {
            predicates.add(criteriaBuilder.equal(root.get("seller").get("id"), filter.getSellerID()));
        }

        // Filter by buyer ID if set and greater than 0
        if (filter.getBuyerID() != null && filter.getBuyerID() > 0) {
            predicates.add(criteriaBuilder.equal(root.get("buyer").get("id"), filter.getBuyerID()));
        }

        // Filter by product name if not null or empty
        if (filter.getProduct() != null && !filter.getProduct().isEmpty()) {
            predicates.add(criteriaBuilder.equal(root.get("product"), filter.getProduct()));
        }

        return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
    }
}
