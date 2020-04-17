package com.lunatech.chef.api.routes

import com.lunatech.chef.api.domain.Dish
import com.lunatech.chef.api.persistence.services.DishesService
import io.ktor.application.call
import io.ktor.http.HttpStatusCode.Companion.Created
import io.ktor.http.HttpStatusCode.Companion.InternalServerError
import io.ktor.http.HttpStatusCode.Companion.NotFound
import io.ktor.http.HttpStatusCode.Companion.OK
import io.ktor.request.receive
import io.ktor.response.respond
import io.ktor.routing.Routing
import io.ktor.routing.delete
import io.ktor.routing.get
import io.ktor.routing.post
import io.ktor.routing.put
import io.ktor.routing.route
import java.util.UUID

data class UpdatedDish(
  val name: String,
  val description: String = "",
  val isVegetarian: Boolean = false,
  val hasNuts: Boolean = false,
  val hasSeafood: Boolean = false,
  val hasPork: Boolean = false,
  val hasBeef: Boolean = false,
  val isGlutenFree: Boolean = false,
  val hasLactose: Boolean = false
)

fun Routing.dishes(dishesService: DishesService) {
    val dishRoute = "/dishes"
    val uuidRoute = "/{uuid}"
    val uuidParam = "uuid"

    route(dishRoute) {
        // get all dishes
        get {
            val dishes = dishesService.getAll()
            call.respond(OK, dishes)
        }
        // create a new single dish
        post {
            val newDish = call.receive<Dish>()
            val inserted = dishesService.insert(newDish)
            if (inserted == 1) call.respond(Created) else call.respond(InternalServerError)
        }

        route(uuidRoute) {
            // get single dish
            get {
                val uuid = call.parameters[uuidParam]
                val dish = dishesService.getByUuid(UUID.fromString(uuid))
                if (dish.isEmpty()) {
                    call.respond(NotFound)
                } else {
                    call.respond(OK, dish.first())
                }
            }
            // modify existing dish
            put {
                val uuid = call.parameters[uuidParam]
                val updatedDish = call.receive<UpdatedDish>()
                val result = dishesService.update(UUID.fromString(uuid), updatedDish)
                if (result == 1) call.respond(OK) else call.respond(InternalServerError)
            }
            // delete a single dish
            delete {
                val uuid = call.parameters[uuidParam]
                val result = dishesService.delete(UUID.fromString(uuid))
                if (result == 1) call.respond(OK) else call.respond(InternalServerError)
            }
        }
    }
}
