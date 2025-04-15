package cz.itnetwork.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity(name = "invoice")
@Getter
@Setter
public class InvoiceEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private int invoiceNumber;

    @ManyToOne
    @JoinColumn(name = "seller_id", nullable = false)
    private PersonEntity seller;

    @ManyToOne
    @JoinColumn(name = "buyer_id", nullable = false)
    private PersonEntity buyer;

    private LocalDate issued;
    private LocalDate dueDate;

    private String product;
    private double price;
    private int vat;
    private String note;
}
