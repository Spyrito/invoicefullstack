package cz.itnetwork.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;


@Getter
@Setter
@Entity(name = "user")
public class UserEntity implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long userId;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private boolean admin = false;

    @Override
    public String getUsername() {
        return email;
    }

    /**
     * Returns granted authorities (roles). Uses "ROLE_ADMIN" if admin is true, otherwise "ROLE_USER".
     */
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        GrantedAuthority grantedAuthority = new SimpleGrantedAuthority("ROLE_" + (admin ? "ADMIN" : "USER"));
        return List.of(grantedAuthority);
    }

    /**
     * The following methods are required by Spring Security's UserDetails.
     * They control the account state. Here, all accounts are considered valid.
     */

    // Account is never expired
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    // Account is never locked
    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    // Credentials are never expired
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    // Account is always enabled
    @Override
    public boolean isEnabled() {
        return true;
    }
}