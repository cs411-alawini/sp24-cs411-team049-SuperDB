package com.housing.mapper;

import com.housing.entity.UserEntity;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface UserMapper {

    @Insert("INSERT INTO User(username, email, password) " +
            "VALUES(#{username}, #{email}, #{password})")
    @Options(useGeneratedKeys = true, keyProperty = "userID")
    int insertUser(UserEntity user);

    @Select("SELECT * FROM User WHERE username = #{username}")
    UserEntity findByUsername(@Param("username") String username);

    @Select("SELECT * FROM User WHERE email = #{email}")
    UserEntity findByEmail(@Param("email") String email);
}
