/*  _____ _______         _                      _
 * |_   _|__   __|       | |                    | |
 *   | |    | |_ __   ___| |___      _____  _ __| | __  ___ ____
 *   | |    | | '_ \ / _ \ __\ \ /\ / / _ \| '__| |/ / / __|_  /
 *  _| |_   | | | | |  __/ |_ \ V  V / (_) | |  |   < | (__ / /
 * |_____|  |_|_| |_|\___|\__| \_/\_/ \___/|_|  |_|\_(_)___/___|
 *                                _
 *              ___ ___ ___ _____|_|_ _ _____
 *             | . |  _| -_|     | | | |     |  LICENCE
 *             |  _|_| |___|_|_|_|_|___|_|_|_|
 *             |_|
 *
 *   PROGRAMOVÁNÍ  <>  DESIGN  <>  PRÁCE/PODNIKÁNÍ  <>  HW A SW
 *
 * Tento zdrojový kód je součástí výukových seriálů na
 * IT sociální síti WWW.ITNETWORK.CZ
 *
 * Kód spadá pod licenci prémiového obsahu a vznikl díky podpoře
 * našich členů. Je určen pouze pro osobní užití a nesmí být šířen.
 * Více informací na http://www.itnetwork.cz/licence
 */
package cz.itnetwork.controller;

import cz.itnetwork.dto.*;
import cz.itnetwork.entity.filter.PersonFilter;
import cz.itnetwork.service.PersonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class PersonController {

    @Autowired
    private PersonService personService;

    /**
     * Creates a new person entity based on the provided data.
     */
    @PostMapping("/persons")
    public PersonDTO addPerson(@RequestBody PersonDTO personDTO) {
        return personService.addPerson(personDTO);
    }

    /**
     * Retrieves a list of persons filtered by optional parameters such as:
     * - identification number
     * - pagination (limit and page)
     */
    @GetMapping("/persons")
    public List<PersonDTO> getPersons(
            @RequestParam(required = false) String identificationNumber,
            @RequestParam(required = false) Integer limit,
            @RequestParam(required = false) Integer page
    ) {
        PersonFilter filter = new PersonFilter(identificationNumber, limit, page);
        return personService.getAll(filter);
    }

    /**
     * Returns the total count of persons matching the filter (currently only identificationNumber).
     * Useful for pagination or displaying summary data.
     */
    @GetMapping("/persons/count")
    public PersonCountDTO getPersonCount(
            @RequestParam(required = false) String identificationNumber) {
        PersonFilter filter = new PersonFilter(identificationNumber, null, null);
        long count = personService.getPersonCount(filter);
        return new PersonCountDTO(count);
    }

    /**
     * Retrieves a single person by their unique ID.
     */
    @GetMapping("/persons/{personId}")
    public PersonDTO getPerson(@PathVariable Long personId){
        return personService.getPerson(personId);
    }

    /**
     * Deletes a person by ID.
     * Only accessible to users with ROLE_ADMIN.
     */
    @Secured("ROLE_ADMIN")
    @DeleteMapping("/persons/{personId}")
    public void deletePerson(@PathVariable Long personId) {
        personService.removePerson(personId);
    }

    /**
     * Updates an existing person's information.
     * Only accessible to users with ROLE_ADMIN.
     */
    @Secured("ROLE_ADMIN")
    @PutMapping({"/persons/{personId}"})
    public PersonDTO editPerson(@PathVariable Long personId, @RequestBody PersonDTO personDTO) {
        return personService.editPerson(personId, personDTO);
    }

    /**
     * Returns statistical data for persons matching the given filter.
     * Supports optional filtering by identification number and pagination.
     */
    @GetMapping("/persons/statistics")
    public List<PersonStatisticsDTO> getPersonStatistics(
            @RequestParam(required = false) String identificationNumber,
            @RequestParam(required = false) Integer limit,
            @RequestParam(required = false) Integer page
    ) {
        PersonFilter filter = new PersonFilter(identificationNumber, limit, page);
        return personService.getPersonStatistics(filter);
    }
}
