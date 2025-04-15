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
package cz.itnetwork.service;

import cz.itnetwork.dto.*;
import cz.itnetwork.dto.mapper.InvoiceMapper;
import cz.itnetwork.dto.mapper.PersonMapper;
import cz.itnetwork.entity.InvoiceEntity;
import cz.itnetwork.entity.PersonEntity;
import cz.itnetwork.entity.filter.PersonFilter;
import cz.itnetwork.entity.repository.InvoiceRepository;
import cz.itnetwork.entity.repository.PersonRepository;
import cz.itnetwork.entity.repository.specification.PersonSpecification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Service;
import org.webjars.NotFoundException;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PersonServiceImpl implements PersonService {

    @Autowired
    private PersonMapper personMapper;

    @Autowired
    private PersonRepository personRepository;

    @Autowired
    private InvoiceRepository invoiceRepository;

    @Autowired
    private InvoiceMapper invoiceMapper;

    /**
     * Adds a new person to the database.
     */
    public PersonDTO addPerson(PersonDTO personDTO) {
        PersonEntity entity = personMapper.toEntity(personDTO);
        entity = personRepository.save(entity);
        return personMapper.toDTO(entity);
    }

    /**
     * Edits an existing person.
     * If the identification number has changed, an exception is thrown.
     * The old person is marked as hidden and a new record is created.
     */
    public PersonDTO editPerson(Long personId, PersonDTO personDTO) {
        PersonEntity existingPerson = fetchPersonById(personId);

        // Prevent changing the identification number
        if (!existingPerson.getIdentificationNumber().equals(personDTO.getIdentificationNumber())) {
            throw new IllegalArgumentException("Identification Number cannot be changed.");
        }

        // Mark old person as hidden
        existingPerson.setHidden(true);
        personRepository.save(existingPerson);

        // Save new person entry
        PersonEntity newPerson = personMapper.toEntity(personDTO);
        PersonEntity savedPerson = personRepository.save(newPerson);

        return personMapper.toDTO(savedPerson);
    }

    /**
     * Marks a person as hidden instead of deleting them.
     */
    @Override
    public void removePerson(long personId) {
        try {
            PersonEntity person = fetchPersonById(personId);
            person.setHidden(true);
            personRepository.save(person);
        } catch (NotFoundException ignored) {
            // Do nothing if person not found
        }
    }

    /**
     * Returns all persons, optionally filtered.
     * Only returns non-hidden persons.
     */
    @Override
    public List<PersonDTO> getAll(@Nullable PersonFilter personFilter) {
        Pageable pageable = getPageable(personFilter);

        Specification<PersonEntity> specification = personFilter == null
                ? Specification.where((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("hidden"), false))
                : new PersonSpecification(personFilter)
                .and((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("hidden"), false));

        return personRepository.findAll(specification, pageable).getContent()
                .stream()
                .map(personMapper::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Returns a single person by ID.
     */
    @Override
    public PersonDTO getPerson(Long personId) {
        PersonEntity personEntity = fetchPersonById(personId);
        return personMapper.toDTO(personEntity);
    }

    /**
     * Computes statistics (revenue) for all persons.
     */
    public List<PersonStatisticsDTO> getPersonStatistics(@Nullable PersonFilter filter) {
        Pageable pageable = getPageable(filter);

        Specification<PersonEntity> specification = filter == null
                ? Specification.where((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("hidden"), false))
                : new PersonSpecification(filter)
                .and((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("hidden"), false));

        return personRepository.findAll(specification, pageable).getContent()
                .stream()
                .map(person -> new PersonStatisticsDTO(
                        person.getId(),
                        person.getName(),
                        calculateRevenue(person.getIdentificationNumber())
                ))
                .collect(Collectors.toList());
    }


    /**
     * Counts how many persons match the filter.
     * Only counts non-hidden entries.
     */
    @Override
    public long getPersonCount(@Nullable PersonFilter personFilter) {
        Specification<PersonEntity> specification = new PersonSpecification(personFilter)
                .and((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("hidden"), false));

        return personRepository.count(specification);
    }

    /**
     * Calculates revenue for a person based on their identification number.
     */
    private double calculateRevenue(String identificationNumber) {
        return invoiceRepository.findBySeller_IdentificationNumber(identificationNumber).stream()
                .mapToDouble(InvoiceEntity::getPrice)
                .sum();
    }

    /**
     * Helper to find a person by ID or throw exception.
     */
    private PersonEntity fetchPersonById(long id) {
        return personRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Person with id " + id + " wasn't found in the database."));
    }

    /**
     * Creates a pageable object based on filter, or returns unpaged if missing.
     */
    private Pageable getPageable(@Nullable PersonFilter filter) {
        if (filter == null || filter.getLimit() == null || filter.getPage() == null) {
            return Pageable.unpaged();  // No paging
        }

        return PageRequest.of(filter.getPage(), filter.getLimit());
    }

}
