package cz.itnetwork.service;

import cz.itnetwork.dto.UserDTO;
import org.springframework.security.core.userdetails.UserDetailsService;

public interface UserService extends UserDetailsService {

    /**
     * Creates a new user in the system.
     * @param model The user data to create.
     * @return The created user with their ID and email.
     */
    UserDTO create(UserDTO model);

}
