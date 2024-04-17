package com.housing.entity;

import javax.persistence.*;

@Entity
@Table(name = "User")
public class UserEntity {

    @Id
    private int userID;

    @Column(nullable = false, length = 50)
    private String username;

    @Column(nullable = false, length = 64)
    private String password;

    @Column(nullable = false, length = 100)
    private String email;
}
