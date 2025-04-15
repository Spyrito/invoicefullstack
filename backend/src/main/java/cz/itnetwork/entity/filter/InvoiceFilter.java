package cz.itnetwork.entity.filter;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InvoiceFilter {
    private Long buyerID = -1L;
    private Long sellerID = -1L;
    private String product = "";
    private Double fromPrice;
    private Double toPrice;
    private Integer limit = 10;
    private Integer page = 0;
}

