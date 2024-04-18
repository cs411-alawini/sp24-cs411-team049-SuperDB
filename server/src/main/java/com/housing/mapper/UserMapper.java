package com.housing.mapper;

import com.housing.entity.UserEntity;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface UserMapper {

    @Insert("INSERT INTO users(username, email, password) " +
            "VALUES(#{username}, #{email}, #{password})")
    void insertUser(UserEntity user);

    @Select("SELECT * FROM users WHERE username = #{username}")
    UserEntity findByUsername(@Param("username") String username);

    @Select("SELECT * FROM users WHERE email = #{email}")
    UserEntity findByEmail(@Param("email") String email);
}
