package cz.itnetwork.service;

import cz.itnetwork.dto.InvoiceDTO;
import cz.itnetwork.dto.InvoiceStatisticsDTO;
import cz.itnetwork.entity.filter.InvoiceFilter;
import io.micrometer.common.lang.Nullable;

import java.util.List;

public interface InvoiceService {

    /**
     * Adds a new invoice to the database.
     * @param invoiceDTO The invoice data to add.
     * @return The saved invoice.
     */
    InvoiceDTO addInvoice(InvoiceDTO invoiceDTO);

    /**
     * Retrieves a list of all invoices, optionally filtered.
     * @param invoiceFilter Filter criteria (nullable).
     * @return List of invoices.
     */
    List<InvoiceDTO> getAll(InvoiceFilter invoiceFilter);

    /**
     * Gets all invoices where the specified identification number matches the seller.
     * @param identificationNumber Seller's identification number.
     * @return List of sales invoices.
     */
    List<InvoiceDTO> getSellsByIdentificationNumber(String identificationNumber);

    /**
     * Gets all invoices where the specified identification number matches the buyer.
     * @param identificationNumber Buyer's identification number.
     * @return List of purchase invoices.
     */
    List<InvoiceDTO> getPurchasesByIdentificationNumber(String identificationNumber);

    /**
     * Retrieves a single invoice by its ID.
     * @param invoiceId The ID of the invoice.
     * @return The invoice DTO.
     */
    InvoiceDTO getInvoice(Long invoiceId);

    /**
     * Updates an existing invoice.
     * @param invoiceId ID of the invoice to update.
     * @param invoiceDTO Updated invoice data.
     * @return The updated invoice.
     */
    InvoiceDTO editInvoice(Long invoiceId, InvoiceDTO invoiceDTO);

    /**
     * Deletes an invoice by ID.
     * @param id The ID of the invoice to delete.
     */
    void removeInvoice(long id);

    /**
     * Returns statistics about all invoices (total sum, current year sum, count).
     * @return A statistics object with computed data.
     */
    InvoiceStatisticsDTO getInvoiceStatistics();

    /**
     * Gets the count of invoices matching a given filter.
     * @param filter Optional filter for invoices.
     * @return Number of matching invoices.
     */
    long getInvoiceCount(@Nullable InvoiceFilter filter);
}
