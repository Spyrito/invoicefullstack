package cz.itnetwork.entity.repository;

import cz.itnetwork.entity.InvoiceEntity;
import cz.itnetwork.entity.filter.InvoiceFilter;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

public interface InvoiceRepository extends JpaRepository<InvoiceEntity, Long>, JpaSpecificationExecutor<InvoiceEntity> {

    List<InvoiceEntity> findBySeller_IdentificationNumber(String identificationNumber);
    List<InvoiceEntity> findByBuyer_IdentificationNumber(String identificationNumber);
    boolean existsByInvoiceNumber(long invoiceNumber);

    @Query("SELECT COALESCE(SUM(i.price), 0) FROM invoice i WHERE YEAR(i.issued) = YEAR(CURRENT_DATE)")
    BigDecimal sumInvoiceAmountsForCurrentYear();

    @Query("SELECT COALESCE(SUM(i.price), 0) FROM invoice i")
    BigDecimal sumAllInvoiceAmounts();

    @Query("SELECT COUNT(i) FROM invoice i")
    long countAllInvoices();

    @Query("SELECT COALESCE(SUM(i.price), 0) FROM invoice i WHERE i.seller.id = :personId")
    BigDecimal sumInvoiceAmountsByPerson(@Param("personId") Long personId);
}
