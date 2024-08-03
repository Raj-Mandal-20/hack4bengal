package com.example.bethedonor.data.api

import com.google.gson.annotations.SerializedName
import okhttp3.ResponseBody
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.DELETE
import retrofit2.http.GET
import retrofit2.http.Header
import retrofit2.http.POST
import java.util.Date

data class RegistrationRequest(
    val name: String,
    val email: String,
    val phoneNumber: String,
    val dob: Date,
    val gender: String,
    val bloodGroup: String,
    val state: String,
    val city: String,
    val district: String,
    val pin: String,
    val password: String,
    val available: Boolean
)

data class RegistrationResponse(
    val statusCode: String? = null,
    val message: String
)

data class LogInRequest(
    val email: String,
    val password: String
)

data class LogInResponse(
    val token: String? = null,
    val userId: String? = null,
    val message: String = "Login SuccessFull",
    val statusCode: String? = null
)

data class ProfileResponse(
    val myProfile: UserProfile? = null,
    val message: String = "",
    val statusCode: String? = null
)

data class UserProfile(
    @SerializedName("_id")
    val id: String? = null,
    val name: String? = null,
    val email: String? = null,
    val state: String? = null,
    val city: String? = null,
    val district: String? = null,
    val dob: Date? = null,
    val gender: String? = null,
    val pin: String? = null,
    val phoneNumber: String? = null,
    val bloodGroup: String? = null,
    val available: Boolean? = null,
    val requests: List<String>? = null,
    val donates: List<String>? = null,
    val createdAt: Date? = null,
    val updatedAt: Date? = null,
    @SerializedName("__v")
    val v: Int? = null
)

data class AccountResponse(
    val message: String = "",
    val isAccountClosed: Boolean = false,
    val statusCode: String? = null
)

data class BloodRequestsResponse(
    @SerializedName("allBloodRequest") val bloodRequests: List<BloodRequest>? = null,
    val message: String = "",
    val statusCode: String? = null
)

data class BloodRequest(
    @SerializedName("_id")
    val id: String,
    val city: String,
    val state: String,
    val pin: String,
    val bloodUnit: String,
    val bloodGroup: String,
    val donationCenter: String,
    val district: String,
    val deadline: Date,
    val donors: List<String>,
    val userId: String,
    val createdAt: Date,
    val updatedAt: Date,
    @SerializedName("__v")
    val v: Int? = null
)

data class UserIdRequest(val userId: String)

data class UserResponse(
    val user: UserProfile? = null,
    val message: String = "",
    val statusCode: String? = null
)

interface ApiService {
    @POST("auth/signup")
    suspend fun register(@Body request: RegistrationRequest): Response<ResponseBody>

    @POST("auth/signin")
    suspend fun login(@Body request: LogInRequest): Response<ResponseBody>

    @GET("v1/my-profile")
    suspend fun getProfile(@Header("Authorization") token: String): Response<ProfileResponse>

    @GET("v1/all-blood-request")
    suspend fun getAllBloodRequests(@Header("Authorization") token: String): Response<BloodRequestsResponse>

    @POST("v1/fetchUserByUserId")
    suspend fun fetchUserByUserId(
        @Header("Authorization") token: String,
        @Body request: UserIdRequest
    ): Response<UserResponse>

    @DELETE("v1/closeAccount")
    suspend fun closeAccount(
        @Header("Authorization") token: String,
    ): Response<AccountResponse>
}
