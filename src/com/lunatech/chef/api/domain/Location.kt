package com.lunatech.chef.api.domain

import java.util.UUID

data class Location(
  val uuid: UUID,
  val city: String,
  val country: String,
  val isDeleted: Boolean = false
)
