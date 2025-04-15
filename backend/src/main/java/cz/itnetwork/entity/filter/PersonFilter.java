package cz.itnetwork.entity.filter;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PersonFilter {
    private String identificationNumber = "";
    private Integer limit = 10;
    private Integer page = 0;
}
