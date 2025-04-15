package cz.itnetwork.controller;

import cz.itnetwork.dto.InvoiceCountDTO;
import cz.itnetwork.dto.InvoiceDTO;
import cz.itnetwork.dto.InvoiceStatisticsDTO;
import cz.itnetwork.dto.PersonCountDTO;
import cz.itnetwork.entity.filter.InvoiceFilter;
import cz.itnetwork.entity.filter.PersonFilter;
import cz.itnetwork.service.InvoiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class InvoiceController {

    @Autowired
    private InvoiceService invoiceService;

    /**
     * Creates a new invoice.
     * Only users with ROLE_ADMIN can access this endpoint.
     */
    @Secured("ROLE_ADMIN")
    @PostMapping("/invoices")
    public InvoiceDTO addInvoice(@RequestBody InvoiceDTO invoiceDTO) {
        return invoiceService.addInvoice(invoiceDTO);
    }

    /**
     * Retrieves a list of invoices based on optional filter parameters.
     * Supports filtering by price range, seller ID, buyer ID, product name,
     * and pagination (limit and page).
     */
    @GetMapping("/invoices")
    public List<InvoiceDTO> getInvoices(
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) Long sellerID,
            @RequestParam(required = false) Long buyerID,
            @RequestParam(required = false) String product,
            @RequestParam(required = false) Integer limit,
            @RequestParam(required = false) Integer page
    ) {
        InvoiceFilter filter = new InvoiceFilter(buyerID, sellerID, product, minPrice, maxPrice, limit, page);
        return invoiceService.getAll(filter);
    }

    /**
     * Returns the total count of invoices matching the given filter parameters.
     * Useful for pagination or statistical purposes.
     */
    @GetMapping("/invoices/count")
    public InvoiceCountDTO getInvoiceCount(
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) Long sellerID,
            @RequestParam(required = false) Long buyerID,
            @RequestParam(required = false) String product,
            @RequestParam(required = false) Integer limit,
            @RequestParam(required = false) Integer page
    ) {
        InvoiceFilter filter = new InvoiceFilter(buyerID, sellerID, product, minPrice, maxPrice, limit, page);
        long count = invoiceService.getInvoiceCount(filter);
        return new InvoiceCountDTO(count);
    }

    /**
     * Retrieves a single invoice by its ID.
     */
    @GetMapping("/invoices/{invoiceId}")
    public InvoiceDTO getInvoice(@PathVariable Long invoiceId){
        return invoiceService.getInvoice(invoiceId);
    }

    /**
     * Returns all invoices where the entity with the given identification number is the seller.
     */
    @GetMapping("/identification/{identificationNumber}/sales")
    public List<InvoiceDTO> getSellsByIdentificationNumber(@PathVariable String identificationNumber) {
        return invoiceService.getSellsByIdentificationNumber(identificationNumber);
    }

    /**
     * Returns all invoices where the entity with the given identification number is the buyer.
     */
    @GetMapping("/identification/{identificationNumber}/purchases")
    public List<InvoiceDTO> getPurchasesByIdentificationNumber(@PathVariable String identificationNumber) {
        return invoiceService.getPurchasesByIdentificationNumber(identificationNumber);
    }

    /**
     * Updates an existing invoice with the given ID.
     * Only accessible to users with ROLE_ADMIN.
     */
    @Secured("ROLE_ADMIN")
    @PutMapping({"/invoices/{invoiceId}"})
    public InvoiceDTO editInvoice(@PathVariable Long invoiceId, @RequestBody InvoiceDTO invoiceDTO) {
        return invoiceService.editInvoice(invoiceId, invoiceDTO);
    }

    /**
     * Deletes the invoice with the given ID.
     * Only accessible to users with ROLE_ADMIN.
     */
    @Secured("ROLE_ADMIN")
    @DeleteMapping("/invoices/{invoiceId}")
    public ResponseEntity<Void> deleteInvoice(@PathVariable Long invoiceId) {
        invoiceService.removeInvoice(invoiceId);
        return ResponseEntity.noContent().build();
    }

    /**
     * Returns statistical data about invoices (Year sum, All time sum, invoices count).
     */
    @GetMapping("/invoices/statistics")
    public InvoiceStatisticsDTO getInvoiceStatistics() {
        return invoiceService.getInvoiceStatistics();
    }
}
