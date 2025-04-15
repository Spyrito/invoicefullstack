package cz.itnetwork.service;

import cz.itnetwork.dto.*;
import cz.itnetwork.entity.filter.PersonFilter;
import io.micrometer.common.lang.Nullable;

import java.util.List;

public interface PersonService {

    /**
     * Creates a new person.
     * @param personDTO The data of the person to create.
     * @return The newly created person.
     */
    PersonDTO addPerson(PersonDTO personDTO);

    /**
     * Edits an existing person.
     * @param personId The ID of the person to edit.
     * @param personDTO The updated person data.
     * @return The updated person.
     */
    PersonDTO editPerson(Long personId, PersonDTO personDTO);

    /**
     * Marks the person as hidden (inactive) by setting the hidden flag to true.
     * If the person with the provided ID is not found, the method silently fails.
     * @param id The ID of the person to mark as hidden.
     */
    void removePerson(long id);

    /**
     * Retrieves a list of all non-hidden persons, optionally filtered by the given filter.
     * @param personFilter Filter criteria for the persons (nullable).
     * @return List of non-hidden persons.
     */
    List<PersonDTO> getAll(PersonFilter personFilter);

    /**
     * Retrieves a single person by their ID.
     * @param personId The ID of the person to retrieve.
     * @return The person with the given ID.
     */
    PersonDTO getPerson(Long personId);

    /**
     * Retrieves statistics for persons based on the given filter.
     * @param personFilter The filter criteria for the statistics (nullable).
     * @return List of person statistics.
     */
    List<PersonStatisticsDTO> getPersonStatistics(PersonFilter personFilter);

    /**
     * Returns the count of persons matching the given filter.
     * Only counts non-hidden persons.
     * @param filter Optional filter for the persons.
     * @return The count of matching persons.
     */
    long getPersonCount(@Nullable PersonFilter filter);
}
