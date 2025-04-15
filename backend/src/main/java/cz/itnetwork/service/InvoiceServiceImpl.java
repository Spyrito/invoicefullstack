package cz.itnetwork.service;

import cz.itnetwork.dto.InvoiceDTO;
import cz.itnetwork.dto.InvoiceStatisticsDTO;
import cz.itnetwork.dto.mapper.InvoiceMapper;
import cz.itnetwork.entity.InvoiceEntity;
import cz.itnetwork.entity.PersonEntity;
import cz.itnetwork.entity.filter.InvoiceFilter;
import cz.itnetwork.entity.repository.InvoiceRepository;
import cz.itnetwork.entity.repository.PersonRepository;
import cz.itnetwork.entity.repository.specification.InvoiceSpecification;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Service;
import org.webjars.NotFoundException;

import java.math.BigDecimal;
import java.time.Year;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class InvoiceServiceImpl implements InvoiceService {

    @Autowired
    private InvoiceMapper invoiceMapper;

    @Autowired
    private InvoiceRepository invoiceRepository;

    @Autowired
    private PersonRepository personRepository;

    /**
     * Adds a new invoice to the database.
     * Checks for duplicate invoice number and links the buyer and seller.
     */
    public InvoiceDTO addInvoice(InvoiceDTO invoiceDTO) {
        if (isInvoiceExist(invoiceDTO.getInvoiceNumber())) {
            throw new IllegalStateException("Invoice with number " + invoiceDTO.getInvoiceNumber() + " already exists.");
        }

        // Load seller and buyer from DB
        PersonEntity seller = personRepository.findById(invoiceDTO.getSeller().getId()).orElseThrow();
        PersonEntity buyer = personRepository.findById(invoiceDTO.getBuyer().getId()).orElseThrow();

        // Map DTO to entity
        InvoiceEntity entity = invoiceMapper.toEntity(invoiceDTO);
        entity.setSeller(seller);
        entity.setBuyer(buyer);

        // Save and return the invoice
        entity = invoiceRepository.save(entity);
        return invoiceMapper.toDTO(entity);
    }

    /**
     * Retrieves all invoices with optional filtering and pagination.
     */
    public List<InvoiceDTO> getAll(@Nullable InvoiceFilter invoiceFilter) {
        Pageable pageable = getPageable(invoiceFilter);

        Specification<InvoiceEntity> specification = invoiceFilter == null
                ? Specification.where(null)
                : new InvoiceSpecification(invoiceFilter);

        return invoiceRepository.findAll(specification, pageable).getContent()
                .stream()
                .map(invoiceMapper::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Returns all invoices where the given identification number matches the seller.
     */
    @Override
    public List<InvoiceDTO> getSellsByIdentificationNumber(String identificationNumber) {
        return invoiceRepository.findBySeller_IdentificationNumber(identificationNumber)
                .stream()
                .map(invoiceMapper::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Returns all invoices where the given identification number matches the buyer.
     */
    @Override
    public List<InvoiceDTO> getPurchasesByIdentificationNumber(String identificationNumber) {
        return invoiceRepository.findByBuyer_IdentificationNumber(identificationNumber)
                .stream()
                .map(invoiceMapper::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Retrieves a single invoice by ID.
     */
    @Override
    public InvoiceDTO getInvoice(Long invoiceId) {
        InvoiceEntity invoiceEntity = fetchInvoiceById(invoiceId);
        return invoiceMapper.toDTO(invoiceEntity);
    }

    /**
     * Updates an existing invoice based on its ID.
     */
    @Override
    public InvoiceDTO editInvoice(Long invoiceId, InvoiceDTO invoiceDTO) {
        fetchInvoiceById(invoiceId); // Ensure invoice exists
        InvoiceEntity updatedEntity = invoiceMapper.toEntity(invoiceDTO);
        updatedEntity.setId(invoiceId); // Keep the same ID
        InvoiceEntity saved = invoiceRepository.save(updatedEntity);
        return invoiceMapper.toDTO(saved);
    }

    /**
     * Removes an invoice by ID. Does nothing if invoice is not found.
     */
    @Override
    public void removeInvoice(long invoiceId) {
        try {
            InvoiceEntity invoiceEntity = fetchInvoiceById(invoiceId);
            invoiceRepository.delete(invoiceEntity);
        } catch (NotFoundException ignored) {
            // As per interface contract: do nothing if not found
        }
    }

    /**
     * Returns the count of invoices matching the given filter.
     */
    @Override
    public long getInvoiceCount(@Nullable InvoiceFilter invoiceFilter) {
        if (invoiceFilter == null) {
            return invoiceRepository.count();
        }

        Specification<InvoiceEntity> specification = new InvoiceSpecification(invoiceFilter);
        return invoiceRepository.count(specification);
    }

    /**
     * Returns invoice statistics, including total price for current year, all time, and invoice count.
     */
    @Override
    public InvoiceStatisticsDTO getInvoiceStatistics() {
        BigDecimal currentYearSum = invoiceRepository.sumInvoiceAmountsForCurrentYear();
        BigDecimal allTimeSum = invoiceRepository.sumAllInvoiceAmounts();
        long invoicesCount = invoiceRepository.countAllInvoices();

        return new InvoiceStatisticsDTO(
                currentYearSum.doubleValue(),
                allTimeSum.doubleValue(),
                (int) invoicesCount
        );
    }

    /**
     * Creates a pageable object based on filter, or returns unpaged if missing.
     */
    private Pageable getPageable(@Nullable InvoiceFilter filter) {
        if (filter == null || filter.getLimit() == null || filter.getPage() == null) {
            return Pageable.unpaged();  // No pagination
        }

        return PageRequest.of(filter.getPage(), filter.getLimit());
    }

    /**
     * Loads an invoice entity by ID or throws NotFoundException.
     */
    private InvoiceEntity fetchInvoiceById(long id) {
        return invoiceRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Invoice with id " + id + " wasn't found in the database."));
    }

    /**
     * Checks if an invoice number already exists in the database.
     */
    private boolean isInvoiceExist(int invoiceNumber) {
        return invoiceRepository.existsByInvoiceNumber(invoiceNumber);
    }
}
