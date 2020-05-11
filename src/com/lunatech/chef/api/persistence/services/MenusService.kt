package com.lunatech.chef.api.persistence.services

import com.lunatech.chef.api.domain.DishOnMenu
import com.lunatech.chef.api.domain.Menu
import com.lunatech.chef.api.persistence.schemas.DishesOnMenus
import com.lunatech.chef.api.persistence.schemas.MenuNames
import com.lunatech.chef.api.routes.UpdatedMenu
import java.util.UUID
import me.liuwj.ktorm.database.Database
import me.liuwj.ktorm.dsl.and
import me.liuwj.ktorm.dsl.delete
import me.liuwj.ktorm.dsl.eq
import me.liuwj.ktorm.dsl.from
import me.liuwj.ktorm.dsl.insert
import me.liuwj.ktorm.dsl.select
import me.liuwj.ktorm.dsl.update
import me.liuwj.ktorm.dsl.where

class MenusService(val database: Database) {
    fun getAll(): List<Menu> =
        database
            .from(MenuNames)
            .select()
            .where { MenuNames.isDeleted eq false }
            .map { MenuNames.createEntity(it) }
            .map { menuName ->
                val dishes =
                    database
                    .from(DishesOnMenus)
                    .select().where { DishesOnMenus.menuUuid eq menuName.uuid }
                    .map { DishesOnMenus.createEntity(it) }
                    .map { it.dishUuid }

                Menu(menuName.uuid, menuName.name, dishes)
    }

    fun getByUuid(uuid: UUID): Menu? {
        val menuName =
            database
            .from(MenuNames)
            .select().where { -> (MenuNames.uuid eq uuid) and (MenuNames.isDeleted eq false) }
            .map { MenuNames.createEntity(it) }
            .firstOrNull()

        return menuName?.let {
            val dishes =
                database
                .from(DishesOnMenus)
                .select().where { DishesOnMenus.menuUuid eq it.uuid }
                .map { DishesOnMenus.createEntity(it) }
                .map { it.dishUuid }
            Menu(it.uuid, it.name, dishes) }
    }

    fun insert(menu: Menu): Int {
        database.insert(MenuNames) {
            it.uuid to menu.uuid
            it.name to menu.name
            it.isDeleted to menu.isDeleted
        }

        return menu.dishesUuid.map {
            val dishOnMenu = DishOnMenu(menuUuid = menu.uuid, dishUuid = it)
            database.insert(DishesOnMenus) {
                it.menuUuid to dishOnMenu.menuUuid
                it.dishUuid to dishOnMenu.dishUuid
            }
        }.size
    }

    fun update(uuid: UUID, menu: UpdatedMenu): Int {
        val updatedName = database.update(MenuNames) {
            it.name to menu.name
            where {
                it.uuid eq uuid
            }
        }

        if(updatedName == 1) {
            database.delete(DishesOnMenus) {it.menuUuid eq uuid}
            menu.dishesUuid.map { dishUuid ->
                database.insert(DishesOnMenus){
                    it.menuUuid to uuid
                    it.dishUuid to dishUuid
                }
            }
        }
        return updatedName
    }

    fun delete(uuid: UUID): Int = database.update(MenuNames) {
        it.isDeleted to true
        where {
            it.uuid eq uuid
        }
    }
}
